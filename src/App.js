import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {LandingPage} from "./pages/home/landing_page";
import {BlogView} from "./pages/blog/blogView";
import {Dashboard} from "./pages/dashboard/dashboard";
import {ViewPost} from "./pages/blog/view_post";
import {CustomNavbar} from "./components/navbar";
import {CustomFooter} from "./components/footer";
import {Settings} from "./pages/dashboard/settings";
import { LoginPage } from './pages/auth/login/loginPage';
import { RegisterPage } from './pages/auth/register/registerPage';
import { ResetPasswordPage } from './pages/auth/resetpassword/resetPasswordPage';
import PrivateRoute from './PrivateRoute';
import {FaqsView} from "./components/faqs";


function App() {
    return (
        <div className="App">
            <Router>
                <CustomNavbar/>
                <Routes>
                    <Route path='/' element={<LandingPage/>}/>
                    <Route path='/papers' element={<BlogView/>}/>
                    {/* <Route path='/faqs' element={<FaqsView/>}/> */}
                    <Route
                        path='/dashboard' 
                        element={
                            <PrivateRoute>
                                <Dashboard/>
                            </PrivateRoute>
                        }
                    />

                    <Route 
                        path='/view-post/:id' 
                        element={
                            <PrivateRoute>
                                <ViewPost/>
                            </PrivateRoute>
                        }
                    />
                    <Route path='/login' element={<LoginPage />}/>
                    <Route path='/register' element={<RegisterPage />}/>
                    <Route path='/resetpassword' element={<ResetPasswordPage />}/>
                    <Route path='*' element={<LandingPage/>}/>

                    {/* UNDER REVIEW - SHOULD BE UNDER DASHBOARD */}
                    {/* <Route path='/settings' element={<Settings/>}/> */}
                </Routes>
                <CustomFooter/>
            </Router>
        </div>
    );
}

export default App;
