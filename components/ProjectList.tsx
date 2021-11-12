import ProjectItem from "./ProjectItem";
import { Project } from "../models/project-model";
import { useState, useRef } from "react";

interface Props {
    projects: Project[];
}

function Project({ projects }: Props) {
    // add types for projects when pulling from db
    return (
        <div>
            {
                projects.map((project: Project) => {
                    return (
                        <ProjectItem project={project} key={project.project_id} />
                    )
                })
            }
        </div>
    )
}


export default Project;
