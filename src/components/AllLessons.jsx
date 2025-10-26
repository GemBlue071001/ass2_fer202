import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Table, Button, Spinner, Alert } from "react-bootstrap"

const AllLessons = () => {
    const [coureses, setCourses] = useState([]) // Initialize as empty array
    const [loading, setLoading] = useState(true) // Add loading state
    const [error, setError] = useState(null) // Add error state
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    console.log(baseUrl);
    

    const getAllCourse = async () => {
        try {
            setLoading(true)
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let result = await response.json();
            // Sort by id in descending order as required
            result = result.sort((a, b) => b.id - a.id);
            setCourses(result)
            console.log(result);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getAllCourse()
    }, [])

    const handleDelete = async (lessonId) => {
        // TODO: Implement delete functionality
        try {
            setLoading(true)
            const response = await fetch(`${baseUrl}/${lessonId}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log("Lesson created successfully:", result)

        } catch (err) {
            console.error("Error creating lesson:", err)
        } finally {
            setLoading(false)
            getAllCourse()
        }


        // You can add actual delete API call here
    }
    const navigate = useNavigate()
    return (
        <>
            <div className="container mt-4">
                <div className="d-flex justify-content-between">
                    <h1 className="mb-4">All Lessons</h1>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="mx-4 mt-3"
                        onClick={() => { navigate("/AddLesson") }}
                        style={{ height: "50px" }}
                    >
                        Add Lesson
                    </Button>
                </div>


                {loading && (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}

                {error && (
                    <Alert variant="danger">
                        <strong>Error:</strong> {error}
                    </Alert>
                )}

                {!loading && !error && coureses.length === 0 && (
                    <Alert variant="info">
                        No lessons available.
                    </Alert>
                )}

                {!loading && !error && coureses.length > 0 && (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Level</th>
                                <th>Estimated Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coureses.map((lesson) => {
                                return (
                                    (
                                        <tr key={lesson.id}>
                                            <td>{lesson.id}</td>
                                            <td style={{ width: '100px' }}>
                                                <img
                                                    src={lesson.lessonImage}
                                                    alt={lesson.lessonTitle}
                                                    style={{
                                                        objectFit: 'cover',
                                                        borderRadius: '4px'
                                                    }}
                                                    className="img-thumbnail"
                                                />
                                            </td>
                                            <td>
                                                <Link to={`/detail/${lesson.id}`} >
                                                    {lesson.lessonTitle}
                                                </Link>
                                            </td>
                                            <td>
                                                <span className="badge bg-info text-dark">
                                                    {lesson.level}
                                                </span>
                                            </td>
                                            <td>
                                                <i className="bi bi-clock-fill me-1 text-muted"></i>
                                                {lesson.estimatedTime} min
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        as={Link}
                                                        to={`/edit/${lesson.id}`}
                                                        variant="outline-primary"
                                                        size="sm"
                                                        title="Edit Lesson"
                                                    >
                                                        <i className="bi bi-pencil-fill me-1"></i>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(lesson.id)}
                                                        title="Delete Lesson"
                                                    >
                                                        <i className="bi bi-trash-fill me-1"></i>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            })}
                        </tbody>
                    </Table>
                )}
            </div>
        </>
    )
}

export default AllLessons