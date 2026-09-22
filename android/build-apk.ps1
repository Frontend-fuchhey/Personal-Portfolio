# Shrawan OS Android APK Build Script
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# 1. Resolve Android SDK
$sdk = $env:ANDROID_HOME
if (-not $sdk -or -not (Test-Path $sdk)) {
    $sdk = $env:ANDROID_SDK_ROOT
}
if (-not $sdk -or -not (Test-Path $sdk)) {
    $sdk = "$env:LOCALAPPDATA\Android\Sdk"
}
if (-not (Test-Path $sdk)) {
    throw "Android SDK not found at $sdk. Please set ANDROID_HOME."
}

# 2. Find Build Tools & Platform
$buildToolsDir = Get-ChildItem "$sdk\build-tools" | Sort-Object Name -Descending | Select-Object -First 1
if (-not $buildToolsDir) {
    throw "No build-tools found in $sdk\build-tools"
}
$buildTools = $buildToolsDir.FullName

$platformJar = Get-ChildItem "$sdk\platforms\*\android.jar" | Sort-Object FullName -Descending | Select-Object -First 1
if (-not $platformJar) {
    throw "android.jar not found in $sdk\platforms"
}
$platform = $platformJar.FullName

Write-Host "Using Android SDK: $sdk" -ForegroundColor Cyan
Write-Host "Using Build-Tools: $buildTools" -ForegroundColor Cyan
Write-Host "Using Platform:    $platform" -ForegroundColor Cyan

$aapt = "$buildTools\aapt.exe"
$d8 = "$buildTools\d8.bat"
$zipalign = "$buildTools\zipalign.exe"
$apksigner = "$buildTools\apksigner.bat"

# 3. Setup Working Directories
$workDir = "$scriptDir\build"
if (Test-Path $workDir) { Remove-Item -Recurse -Force $workDir }
$genDir = "$workDir\gen"
$binDir = "$workDir\bin"
$classesDir = "$binDir\classes"
$assetsDir = "$workDir\assets"

New-Item -ItemType Directory -Force -Path $genDir | Out-Null
New-Item -ItemType Directory -Force -Path $classesDir | Out-Null
New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null

# 4. Stage Web Assets from dist (excluding downloads to keep APK lean)
Write-Host "Staging web assets into APK..." -ForegroundColor Yellow
$distDir = "$projectRoot\dist"
if (Test-Path $distDir) {
    Get-ChildItem -Path $distDir | Where-Object { $_.Name -ne "downloads" } | ForEach-Object {
        Copy-Item -Recurse -Force -Path $_.FullName -Destination "$assetsDir\$($_.Name)"
    }
}

# 5. Generate R.java and resources.ap_ with bundled assets
Write-Host "Packaging resources and web assets..." -ForegroundColor Yellow
& $aapt package -f -m -J $genDir -M "$scriptDir\AndroidManifest.xml" -S "$scriptDir\res" -A "$assetsDir" -I $platform -F "$binDir\resources.ap_"
if ($LASTEXITCODE -ne 0) { throw "aapt package failed with exit code $LASTEXITCODE" }

# 5. Compile Java sources
Write-Host "Compiling Java sources..." -ForegroundColor Yellow
$javaSources = @(
    "$genDir\np\com\shrawankarki\os\R.java",
    "$scriptDir\src\np\com\shrawankarki\os\MainActivity.java"
)
javac --release 8 -cp $platform -d $classesDir $javaSources
if ($LASTEXITCODE -ne 0) { throw "javac failed with exit code $LASTEXITCODE" }

# 6. Convert bytecode to Dalvik DEX
Write-Host "Compiling DEX with d8..." -ForegroundColor Yellow
$classFiles = (Get-ChildItem -Recurse "$classesDir\*.class").FullName
& $d8 --lib $platform --output $binDir $classFiles
if ($LASTEXITCODE -ne 0) { throw "d8 failed with exit code $LASTEXITCODE" }

# 7. Package classes.dex into unaligned APK
Write-Host "Packaging classes.dex..." -ForegroundColor Yellow
Copy-Item "$binDir\resources.ap_" "$binDir\unaligned.apk"
Push-Location $binDir
try {
    & $aapt add "unaligned.apk" "classes.dex"
} finally {
    Pop-Location
}

# 8. Align APK (4-byte alignment)
Write-Host "Aligning APK..." -ForegroundColor Yellow
& $zipalign -f -p 4 "$binDir\unaligned.apk" "$binDir\aligned.apk"
if ($LASTEXITCODE -ne 0) { throw "zipalign failed with exit code $LASTEXITCODE" }

# 9. Ensure Signing Keystore exists
$keystoreDir = "$scriptDir\keystore"
if (-not (Test-Path $keystoreDir)) { New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null }
$keystorePath = "$keystoreDir\release.keystore"
if (-not (Test-Path $keystorePath)) {
    Write-Host "Generating release keystore..." -ForegroundColor Yellow
    keytool -genkey -v -keystore $keystorePath -alias "shrawanos" -keyalg RSA -keysize 2048 -validity 10000 -storepass "shrawan123" -keypass "shrawan123" -dname "CN=Shrawan Karki, OU=Portfolio, O=ShrawanOS, L=Biratnagar, ST=Koshi, C=NP"
}

# 10. Sign APK (v1, v2, v3)
Write-Host "Signing APK with apksigner..." -ForegroundColor Yellow
$outputApk = "$binDir\ShrawanOS.apk"
& $apksigner sign --ks $keystorePath --ks-pass "pass:shrawan123" --key-pass "pass:shrawan123" --ks-key-alias "shrawanos" --out $outputApk "$binDir\aligned.apk"
if ($LASTEXITCODE -ne 0) { throw "apksigner failed with exit code $LASTEXITCODE" }

# 11. Verify APK signature
Write-Host "Verifying APK signature..." -ForegroundColor Yellow
& $apksigner verify -v --min-sdk-version 21 $outputApk

# 12. Copy APK to public/downloads and dist/downloads
$publicDest = "$projectRoot\public\downloads\ShrawanOS.apk"
$distDest = "$projectRoot\dist\downloads\ShrawanOS.apk"

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $publicDest) | Out-Null
Copy-Item -Force $outputApk $publicDest
Write-Host "Copied to $publicDest" -ForegroundColor Green

if (Test-Path (Split-Path -Parent $distDest)) {
    Copy-Item -Force $outputApk $distDest
    Write-Host "Copied to $distDest" -ForegroundColor Green
}

$apkInfo = Get-Item $publicDest
Write-Host "Successfully built ShrawanOS.apk ($([math]::Round($apkInfo.Length / 1KB, 1)) KB)!" -ForegroundColor Green
