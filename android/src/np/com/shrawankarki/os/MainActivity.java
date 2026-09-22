package np.com.shrawankarki.os;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String TARGET_URL = "https://shrawankarki.com.np/";
    private static final String TARGET_HOST = "shrawankarki.com.np";

    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout errorLayout;
    private TextView errorDetails;
    private AssetManager assetManager;
    private boolean isPageLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#0f172a"));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                window.setNavigationBarColor(Color.parseColor("#0f172a"));
            }
        }

        setContentView(R.layout.activity_main);

        assetManager = getAssets();
        webView = (WebView) findViewById(R.id.webview);
        progressBar = (ProgressBar) findViewById(R.id.progressbar);
        errorLayout = (LinearLayout) findViewById(R.id.error_layout);
        errorDetails = (TextView) findViewById(R.id.error_details);
        Button retryButton = (Button) findViewById(R.id.btn_retry);

        if (retryButton != null) {
            retryButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (errorLayout != null) errorLayout.setVisibility(View.GONE);
                    if (webView != null) webView.loadUrl(TARGET_URL);
                }
            });
        }

        setupWebView();
        webView.loadUrl(TARGET_URL);
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setSupportZoom(false);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        String defaultUA = webSettings.getUserAgentString();
        webSettings.setUserAgentString(defaultUA + " ShrawanOSApp/1.0");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (progressBar != null) {
                    if (newProgress < 100) {
                        progressBar.setVisibility(View.VISIBLE);
                        progressBar.setProgress(newProgress);
                    } else {
                        progressBar.setVisibility(View.GONE);
                    }
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrl(url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && request != null) {
                    return handleUrl(request.getUrl().toString());
                }
                return false;
            }

            private boolean handleUrl(String url) {
                if (url == null) return false;
                Uri uri = Uri.parse(url);
                String host = uri.getHost();

                // Keep requests to our own site inside WebView
                if (host != null && (host.equalsIgnoreCase(TARGET_HOST) || host.endsWith("." + TARGET_HOST))) {
                    return false;
                }

                // If scheme is internal like javascript: or about:
                String scheme = uri.getScheme();
                if ("javascript".equalsIgnoreCase(scheme) || "about".equalsIgnoreCase(scheme)) {
                    return false;
                }

                // External links (LinkedIn, GitHub, mailto, etc.) open in external apps / browser
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && request != null) {
                    WebResourceResponse response = interceptAsset(request.getUrl());
                    if (response != null) return response;
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                if (url != null) {
                    WebResourceResponse response = interceptAsset(Uri.parse(url));
                    if (response != null) return response;
                }
                return super.shouldInterceptRequest(view, url);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // Ensure Let's Encrypt / TLS renegotiation doesn't block the app on older Androids
                handler.proceed();
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                isPageLoaded = true;
                if (errorLayout != null) {
                    errorLayout.setVisibility(View.GONE);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                // Only trigger error if main frame fails and page never loaded
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && request != null && request.isForMainFrame()) {
                    if (!isPageLoaded) {
                        CharSequence desc = (error != null) ? error.getDescription() : "Connection failed";
                        showError(desc != null ? desc.toString() : "Unable to connect");
                    }
                }
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                // Only trigger error if the root URL itself failed and page never loaded
                if (!isPageLoaded && failingUrl != null && isMainUrl(failingUrl)) {
                    showError(description != null ? description : "Unable to connect");
                }
            }

            private boolean isMainUrl(String url) {
                if (url == null) return false;
                Uri uri = Uri.parse(url);
                String host = uri.getHost();
                if (host == null || !host.equalsIgnoreCase(TARGET_HOST)) return false;
                String path = uri.getPath();
                return path == null || path.isEmpty() || path.equals("/") || path.equals("/index.html");
            }

            private void showError(String message) {
                if (errorLayout != null) {
                    errorLayout.setVisibility(View.VISIBLE);
                }
                if (errorDetails != null && message != null) {
                    errorDetails.setText(message);
                }
            }
        });
    }

    private WebResourceResponse interceptAsset(Uri uri) {
        if (uri == null || assetManager == null) return null;
        String host = uri.getHost();
        if (host == null) return null;

        // Only intercept requests for our domain
        if (!host.equalsIgnoreCase(TARGET_HOST) && !host.endsWith("." + TARGET_HOST)) {
            return null;
        }

        String path = uri.getPath();
        if (path == null || path.isEmpty() || path.equals("/")) {
            path = "index.html";
        } else if (path.startsWith("/")) {
            path = path.substring(1);
        }

        try {
            InputStream stream = assetManager.open(path);
            String mimeType = getMimeType(path);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Access-Control-Allow-Origin", "*");
                headers.put("Cache-Control", "no-cache");
                return new WebResourceResponse(mimeType, "UTF-8", 200, "OK", headers, stream);
            } else {
                return new WebResourceResponse(mimeType, "UTF-8", stream);
            }
        } catch (Exception e) {
            // If asset not directly found, check if it's a SPA navigation route (no file extension)
            if (!path.contains(".")) {
                try {
                    InputStream stream = assetManager.open("index.html");
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        Map<String, String> headers = new HashMap<String, String>();
                        headers.put("Access-Control-Allow-Origin", "*");
                        return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, stream);
                    } else {
                        return new WebResourceResponse("text/html", "UTF-8", stream);
                    }
                } catch (Exception ex) {
                    return null;
                }
            }
            return null;
        }
    }

    private String getMimeType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".ico")) return "image/x-icon";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".woff")) return "font/woff";
        if (lower.endsWith(".ttf")) return "font/ttf";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".wav")) return "audio/wav";
        return "application/octet-stream";
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}