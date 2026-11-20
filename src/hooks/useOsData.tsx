import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_ABOUT_DATA, 
  INITIAL_PROJECTS, 
  INITIAL_PROFILE_DATA, 
  INITIAL_SKILLS_DATA,
  ProfileData,
  AboutData,
  SkillCategory,
  ExperienceItem,
  EducationItem
} from '../data/initialData';
import { 
  subscribeToProjects, 
  saveProject, 
  deleteProjectFromDb, 
  ProjectItem,
  subscribeToProfile,
  saveProfileData,
  subscribeToAbout,
  saveAboutData,
  subscribeToSkills,
  saveSkillsData
} from '../lib/portfolioDataService';

interface OsDataContextType {
  profile: ProfileData;
  aboutData: AboutData;
  skills: SkillCategory[];
  projects: ProjectItem[];
  saveProfile: (updated: Partial<ProfileData>) => Promise<void>;
  saveAbout: (updated: Partial<AboutData>) => Promise<void>;
  saveSkills: (categories: SkillCategory[]) => Promise<void>;
  updateExperience: (id: string, updated: Partial<ExperienceItem>) => Promise<void>;
  addExperience: (newExp: Omit<ExperienceItem, 'id'>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  updateEducation: (id: string, updated: Partial<EducationItem>) => Promise<void>;
  addEducation: (newEdu: Omit<EducationItem, 'id'>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  updateProject: (id: string, updated: any) => Promise<void>;
  addProject: (newProj: any) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const OsDataContext = createContext<OsDataContextType | undefined>(undefined);

export function OsDataProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE_DATA);
  const [aboutData, setAboutData] = useState<AboutData>(INITIAL_ABOUT_DATA);
  const [skills, setSkills] = useState<SkillCategory[]>(INITIAL_SKILLS_DATA);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS as unknown as ProjectItem[]);

  // 1. Subscribe to live profile & branding
  useEffect(() => {
    const unsubscribe = subscribeToProfile((liveProfile) => {
      if (liveProfile) setProfile(liveProfile);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to live about section (experience & education)
  useEffect(() => {
    const unsubscribe = subscribeToAbout((liveAbout) => {
      if (liveAbout) setAboutData(liveAbout);
    });
    return () => unsubscribe();
  }, []);

  // 3. Subscribe to live skills & tech stack
  useEffect(() => {
    const unsubscribe = subscribeToSkills((liveSkills) => {
      if (Array.isArray(liveSkills) && liveSkills.length > 0) {
        setSkills(liveSkills);
      }
    });
    return () => unsubscribe();
  }, []);

  // 4. Subscribe to live Firestore projects
  useEffect(() => {
    const unsubscribe = subscribeToProjects((liveProjects) => {
      if (Array.isArray(liveProjects)) setProjects(liveProjects);
    });
    return () => unsubscribe();
  }, []);

  // 5. Update browser favicon dynamically when profile favicon is customized
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const faviconUrl = profile.favicon?.trim() || '/favicon.png';
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [profile.favicon]);

  // Profile saver
  const saveProfile = async (updated: Partial<ProfileData>) => {
    const merged = { ...profile, ...updated };
    setProfile(merged);
    await saveProfileData(merged);
  };

  // About data saver
  const saveAbout = async (updated: Partial<AboutData>) => {
    const merged: AboutData = {
      ...aboutData,
      ...updated,
    };
    setAboutData(merged);
    await saveAboutData(merged);
  };

  // Skills saver
  const saveSkills = async (categories: SkillCategory[]) => {
    setSkills(categories);
    await saveSkillsData(categories);
  };

  // Experience actions with Firestore persistence
  const updateExperience = async (id: string, updated: Partial<ExperienceItem>) => {
    const updatedList = aboutData.experience.map(exp => exp.id === id ? { ...exp, ...updated } : exp);
    await saveAbout({ experience: updatedList });
  };

  const addExperience = async (newExp: Omit<ExperienceItem, 'id'>) => {
    const newItem: ExperienceItem = {
      ...newExp,
      id: `exp_${Date.now()}`
    };
    const updatedList = [newItem, ...aboutData.experience];
    await saveAbout({ experience: updatedList });
  };

  const deleteExperience = async (id: string) => {
    const updatedList = aboutData.experience.filter(exp => exp.id !== id);
    await saveAbout({ experience: updatedList });
  };

  // Education actions with Firestore persistence
  const updateEducation = async (id: string, updated: Partial<EducationItem>) => {
    const updatedList = aboutData.education.map(edu => edu.id === id ? { ...edu, ...updated } : edu);
    await saveAbout({ education: updatedList });
  };

  const addEducation = async (newEdu: Omit<EducationItem, 'id'>) => {
    const newItem: EducationItem = {
      ...newEdu,
      id: `edu_${Date.now()}`
    };
    const updatedList = [...aboutData.education, newItem];
    await saveAbout({ education: updatedList });
  };

  const deleteEducation = async (id: string) => {
    const updatedList = aboutData.education.filter(edu => edu.id !== id);
    await saveAbout({ education: updatedList });
  };

  // Project actions
  const updateProject = async (id: string, updated: any) => {
    setProjects(prev => prev.map(proj => proj.id === id ? { ...proj, ...updated } : proj));
    const target = projects.find(p => p.id === id);
    await saveProject({ ...(target || {}), ...updated, id } as ProjectItem).catch(console.error);
  };

  const addProject = async (newProj: any) => {
    const id = newProj.id || `proj_${Date.now()}`;
    const project = { ...newProj, id };
    setProjects(prev => [...prev, project]);
    await saveProject(project as ProjectItem).catch(console.error);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(proj => proj.id !== id));
    await deleteProjectFromDb(id).catch(console.error);
  };

  return (
    <OsDataContext.Provider value={{
      profile,
      aboutData,
      skills,
      projects,
      saveProfile,
      saveAbout,
      saveSkills,
      updateExperience,
      updateEducation,
      updateProject,
      addExperience,
      addEducation,
      addProject,
      deleteExperience,
      deleteEducation,
      deleteProject
    }}>
      {children}
    </OsDataContext.Provider>
  );
}

export function useOsData() {
  const context = useContext(OsDataContext);
  if (context === undefined) {
    return {
      profile: INITIAL_PROFILE_DATA,
      aboutData: INITIAL_ABOUT_DATA,
      skills: INITIAL_SKILLS_DATA,
      projects: INITIAL_PROJECTS as unknown as ProjectItem[],
      saveProfile: async () => {},
      saveAbout: async () => {},
      saveSkills: async () => {},
      updateExperience: async () => {},
      addExperience: async () => {},
      deleteExperience: async () => {},
      updateEducation: async () => {},
      addEducation: async () => {},
      deleteEducation: async () => {},
      updateProject: async () => {},
      addProject: async () => {},
      deleteProject: async () => {},
    };
  }
  return context;
}
