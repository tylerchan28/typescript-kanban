import Link from "next/link";

// Project is an object being passed as props, so must define project as well
interface Props {
    project: {
        projectId: number;
        userId: number;
        projectName: string;
    }
}


function ProjectItem ({ project }: Props) {
    return (
        <Link href="/project/[projectId]" as={`/project/${project.projectId}`}>
        {/* <Link href={`/project/${project.projectId}`} as={`/project/${project.projectId}`}></Link> */}
 
           <a>
               Name: {project.projectName} <br/>
               Project Id: {project.projectId} <br/><br/>
           </a>
        </Link>
    )
}

export default ProjectItem;