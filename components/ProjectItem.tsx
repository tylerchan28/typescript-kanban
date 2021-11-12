import Link from "next/link";

// Project is an object being passed as props, so must define project as well
interface Props {
    project: {
        project_id: number;
        user_id: number;
        project_name: string;
    }
}


function ProjectItem ({ project }: Props) {
    return (
        <Link href="/project/[projectId]" as={`/project/${project.project_id}`}>
           <a>
               Name: {project.project_name} <br/>
               Project Id: {project.project_id} <br/><br/>
           </a>
        </Link>
    )
}

export default ProjectItem;