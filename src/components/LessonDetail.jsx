import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, Container, Row, Col, Badge, Spinner, Alert, Button } from "react-bootstrap"

const LessonDetail = () => {
    const { id } = useParams() // Get the lesson ID from URL
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getLessonDetail = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${id}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const result = await response.json()
                setLesson(result)
                console.log(result)
            } catch (err) {
                console.error('Error fetching lesson detail:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            getLessonDetail()
        }
    }, [id])

    // Format number with comma separators for thousands
    const formatEstimatedTime = (time) => {
        return new Intl.NumberFormat().format(time)
    }

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading lesson details...</span>
                    </Spinner>
                </div>
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Lesson</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button as={Link} to="/all-lessons" variant="outline-danger">
                            Back to All Lessons
                        </Button>
                    </div>
                </Alert>
            </Container>
        )
    }

    if (!lesson) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    <Alert.Heading>Lesson Not Found</Alert.Heading>
                    <p>The lesson you're looking for doesn't exist.</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button as={Link} to="/all-lessons" variant="outline-warning">
                            Back to All Lessons
                        </Button>
                    </div>
                </Alert>
            </Container>
        )
    }

    return (
        <Container className="mt-4">
            {/* Navigation breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/all-lessons" className="text-decoration-none">All Lessons</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {lesson.lessonTitle}
                    </li>
                </ol>
            </nav>

            {/* Lesson Detail Card */}
            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    <Card className="shadow-sm">
                        {/* Lesson Image */}
                        <Card.Img 
                            variant="top" 
                            src={lesson.lessonImage} 
                            alt={lesson.lessonTitle}
                            style={{ 
                                height: '300px', 
                                objectFit: 'cover',
                                borderRadius: '0.375rem 0.375rem 0 0'
                            }}
                        />
                        
                        <Card.Body className="p-4">
                            {/* Lesson Title */}
                            <Card.Title className="display-6 mb-3">
                                {lesson.lessonTitle}
                            </Card.Title>

                            {/* Lesson Details */}
                            <Row className="mb-4">
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-bar-chart-line-fill me-2 text-primary"></i>
                                        <strong>Level:</strong>
                                        <Badge bg="info" className="ms-2 text-dark">
                                            {lesson.level}
                                        </Badge>
                                    </div>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-clock-fill me-2 text-success"></i>
                                        <strong>Estimated Time:</strong>
                                        <span className="ms-2 text-success fw-bold">
                                            {formatEstimatedTime(lesson.estimatedTime)} minutes
                                        </span>
                                    </div>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-check-circle-fill me-2 text-warning"></i>
                                        <strong>Status:</strong>
                                        <Badge 
                                            bg={lesson.isCompleted ? "success" : "secondary"} 
                                            className="ms-2"
                                        >
                                            {lesson.isCompleted ? "Completed" : "Not Completed"}
                                        </Badge>
                                    </div>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-hash me-2 text-muted"></i>
                                        <strong>Lesson ID:</strong>
                                        <span className="ms-2 text-muted">
                                            #{lesson.id}
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3 mt-4">
                                <Button 
                                    as={Link} 
                                    to={`/lesson/edit/${lesson.id}`}
                                    variant="primary"
                                    size="lg"
                                >
                                    <i className="bi bi-pencil-fill me-2"></i>
                                    Edit Lesson
                                </Button>
                                
                                <Button 
                                    as={Link} 
                                    to="/AllLesson"
                                    variant="outline-secondary"
                                    size="lg"
                                >
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Back to All Lessons
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default LessonDetail