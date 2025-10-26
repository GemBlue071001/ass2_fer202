import { useEffect, useState } from "react"

const Home = () => {
    const [coureses, setCourses] = useState([]) // Initialize as empty array
    const [loading, setLoading] = useState(true) // Add loading state
    const [error, setError] = useState(null) // Add error state

    useEffect(() => {
        const getAllCourse = async () => {
            try {
                setLoading(true)
                const response = await fetch(import.meta.env.VITE_API_BASE_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let result = await response.json();
                result = result.filter(x => !x.isCompleted)
                setCourses(result)
                console.log(result);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message);
                setCourses([]); // Ensure courses is always an array
            } finally {
                setLoading(false);
            }
        }
        getAllCourse()
    }, [])

    return (
        <>
            <div className="container mt-4">
                <h1>courses</h1>
                {loading && <div className="text-center">Loading courses...</div>}
                {error && <div className="alert alert-danger">Error loading courses: {error}</div>}
                {!loading && !error && coureses.length === 0 && (
                    <div className="alert alert-info">No courses available.</div>
                )}
                <div className="row">
                    {
                        coureses.map((course) => {
                            return (
                                <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100">
                                        <img
                                            src={course.lessonImage}
                                            className="card-img-top"
                                            alt={course.lessonTitle}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{course.lessonTitle}</h5>
                                            <p className="card-text flex-grow-1">Level: {course.level}</p>
                                            <p className="card-text flex-grow-1">Estimated Time: {course.estimatedTime} min</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Home 