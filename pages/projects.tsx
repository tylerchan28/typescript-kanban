import Head from 'next/head'
import ProjectList from '../components/ProjectList'
import { Project } from '../models/project-model';
const { Client } = require('pg');
import { useState, useRef, useEffect } from "react";
import { getUserData } from "./api/user";
import axios from "axios";


interface Props {
  projects: Project[],
  id: number,
  addProject: () => void
}
function projects({ projects, id }: Props) {
  const [projectForm, showProjectForm] = useState(false);
  const [currentProjects, setCurrentProjects] = useState(projects);

  const projectNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentProjects(projects)
  }, [])


  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedProject: Project = ({
      user_id: id,
      project_name: projectNameRef.current!.value,
      project_id: Math.random()
    });
    
    axios.post("http://localhost:3000/add-project", submittedProject, {headers: {
      'Content-Type': 'application/json'
    }}).then((res) => {
      submittedProject.project_id = res.data;
      setCurrentProjects([...currentProjects, submittedProject]);
    });
    projectNameRef.current!.value = ""; 
    showProjectForm(!projectForm);
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div>
          <div>User {id}</div>
          <ProjectList projects={currentProjects}/>
          <button onClick={() => showProjectForm(!projectForm)}>
          New Project
        </button>
        { projectForm && 
          <form onSubmit={onFormSubmit}>
            <input 
              type="text"
              ref={projectNameRef}
            />
            <button type="submit">Submit</button>
          </form>
        }
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  let client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  });  
  client.connect((err: Error) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to PostgreSQL');
    }
  });
  
  const userData = await getUserData(context.req.user.email, client);

  return {
    props: {
      projects: userData.projects,
      id: userData.id,
    }
  }
}

export default projects;

