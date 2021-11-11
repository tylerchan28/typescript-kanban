import axios from "axios";
const login = () => {
    return (
        <div>
            <button>
                <a href="/auth/google">Login</a>
            </button>
            <button onClick={() => axios.get("/test").then((res) => console.log(res))}>
                Get Info (test)
            </button>
        </div>
    )
}

// NEED EMAIL FOR GOOGLE CALLBACK
// export const getServerSideProps = async () => {
//     return {
//       props: {
//         projects: projects
//       }
//     }
// }

export default login