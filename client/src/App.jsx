import { Outlet, Navigate,Route,Routes,useLocation } from "react-router-dom"
import { Footer, Navbar } from "./components"
import { About, ApplyJobs, Auth, Companies, CompanyProfile, FindJobs, JobDetail, UploadJob, UserProfile } from "./pages";
import { useSelector } from "react-redux";
import ApplyFrom from "./pages/ApplyFrom";




function Layout (){
   const {user}=useSelector((state)=>state.user);

 
   const location=useLocation()
   

   return user?.token? (
    <Outlet/>
   ) : (<Navigate to="/user-auth" state={{from:location}} replace />)
}


function App() {
 
  const {user}=useSelector((state)=>state.user);
 
 
  return (
   
    <main>
      <Navbar />
      <Routes>
       <Route element={<Layout/>}>
        <Route  path="/" element={<Navigate to='/find-jobs'  replace={true} />} />
        <Route  path="/find-jobs"  element={<FindJobs />} />
        <Route  path="/companies"  element={<Companies />} />
        <Route  path= {user?.accountType==="seeker" ?"/user-profile" :"user-profile/:id"}
           element={<UserProfile/>} />

          <Route path={"/company-profile"} element={<CompanyProfile />} />
          <Route path={"/company-profile/:id"} element={<CompanyProfile />} />
          <Route path={"/upload-job"} element={<UploadJob />} />
          <Route path={"/job-detail/:id"} element={<JobDetail />} />
          <Route path={"/apply-jobs"}  element={<ApplyJobs/>}  />
          <Route  path={"/apply-form/:id"}  element={<ApplyFrom/>}  />
       </Route>

       <Route path="/about-us"  element={<About/>} />
       <Route path="/user-auth"  element={<Auth />}/>
      </Routes>

    { user && <Footer />}

      
    </main>
    
  )
}

export default App
