import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ABOUT_DATA, INITIAL_PROJECTS } from '../data/initialData';

interface OsDataContextType {
  aboutData: typeof INITIAL_ABOUT_DATA;
  projects: typeof INITIAL_PROJECTS;
  updateExperience: (id: string, updated: any) => void;
  updateEducation: (id: string, updated: any) => void;
  updateProject: (id: string, updated: any) => void;
  addExperience: (newExp: any) => void;
  addEducation: (newEdu: any) => void;
  addProject: (newProj: any) => void;
  deleteExperience: (id: string) => void;
  deleteEducation: (id: string) => void;
  deleteProject: (id: string) => void;
}

const OsDataContext = createContext<OsDataContextType | undefined>(undefined);

export function OsDataProvider({ children }: { children: React.ReactNode }) {
  const [aboutData, setAboutData] = useState(INITIAL_ABOUT_DATA);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  const updateExperience = (id: string, updated: any) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, ...updated } : exp)
    }));
  };

  const addExperience = (newExp: any) => {
    setAboutData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...newExp, id: Math.random().toString(36).substr(2, 9) }]
    }));
  };

  const deleteExperience = (id: string) => {
    setAboutData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateEducation = (id: string, updated: any) => {
    setAboutData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, ...updated } : edu)
    }));
  };

  const addEducation = (newEdu: any) => {
    setAboutData(prev => ({
      ...prev,
      education: [...prev.education, { ...newEdu, id: Math.random().toString(36).substr(2, 9) }]
    }));
  };

  const deleteEducation = (id: string) => {
    setAboutData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateProject = (id: string, updated: any) => {
    setProjects(prev => prev.map(proj => proj.id === id ? { ...proj, ...updated } : proj));
  };

  const addProject = (newProj: any) => {
    setProjects(prev => [...prev, { ...newProj, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(proj => proj.id !== id));
  };

  return (
    <OsDataContext.Provider value={{
      aboutData,
      projects,
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
    throw new Error('useOsData must be used within an OsDataProvider');
  }
  return context;
}
