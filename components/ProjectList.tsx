import ProjectItem from "./ProjectItem";
import { Project } from "../models/project-model";
import { useState, useRef } from "react";

interface Props {
    projects: Project[];
}

function Project({ projects }: Props) {
    // add types for projects when pulling from db
    const [projectForm, showProjectForm] = useState(false);
    const projectNameRef = useRef<HTMLInputElement>(null);

    const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const projectName = projectNameRef.current!.value;
      const project: Project = {
          projectName,
          projectId: 4,
          userId: 1,
          todo: [],
          inProgress: [],
          completed: []
      }
      projects.push(project) // need to change state for rerender
      projectNameRef.current!.value = ""
    }
    return (
        <div>
            {
                projects.map((project: Project) => {
                    return (
                        <ProjectItem project={project} key={project.projectId} />
                    )
                })
            }
            <button onClick={() => showProjectForm(!projectForm)}>
          New Project
        </button>
        { projectForm && 
          <form onSubmit={onFormSubmit}>
            <input 
              type="text"
              ref={projectNameRef}
            />
          </form>
        }
        </div>
    )
}

export default Project;