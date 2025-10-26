import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import AllLessons from "./components/AllLessons";
import LessonDetail from "./components/LessonDetail";
import AddLesson from "./components/AddLesson";
import EditLesson from "./components/EditLesson";
import CompletedLesson from "./components/CompletedLesson";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {


  return (
    <>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/AllLesson" element={<AllLessons />}></Route>
          <Route path="/detail/:id" element={<LessonDetail />} />
          <Route path="/edit/:id" element={<EditLesson />} />
          <Route path="/AddLesson" element={<AddLesson />} />
          <Route path="/CompletedLesson" element={<CompletedLesson />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
