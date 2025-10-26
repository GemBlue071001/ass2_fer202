import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap"

const EditLesson = () => {
    const navigate = useNavigate()
    const { id } = useParams() // Get lesson ID from URL
    
    // Form state
    const [formData, setFormData] = useState({
        lessonTitle: "",
        lessonImage: "",
        level: "",
        estimatedTime: "",
        isCompleted: false
    })
    
    // Validation and UI state
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [fetchError, setFetchError] = useState(null)

    // Level options
    const levelOptions = ["N1", "N2", "N3", "N4", "N5"]

    // Fetch existing lesson data
    useEffect(() => {
        const getLessonData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`https://68fe2a877c700772bb12feec.mockapi.io/SE151037/${id}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const lesson = await response.json()
                
                // Populate form with existing data
                setFormData({
                    lessonTitle: lesson.lessonTitle || "",
                    lessonImage: lesson.lessonImage || "",
                    level: lesson.level || "",
                    estimatedTime: lesson.estimatedTime?.toString() || "",
                    isCompleted: lesson.isCompleted || false
                })
            } catch (err) {
                console.error('Error fetching lesson:', err)
                setFetchError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            getLessonData()
        }
    }, [id])

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    // Validation functions (same as AddLesson)
    const validateForm = () => {
        const newErrors = {}

        // Validate lessonTitle - must contain more than 1 word
        if (!formData.lessonTitle.trim()) {
            newErrors.lessonTitle = "Lesson title is required"
        } else if (formData.lessonTitle.trim().split(/\s+/).length < 2) {
            newErrors.lessonTitle = "Lesson title must contain more than 1 word (e.g., 'Kanji Master')"
        }

        // Validate lessonImage - must be a valid URL
        if (!formData.lessonImage.trim()) {
            newErrors.lessonImage = "Lesson image URL is required"
        } else if (!isValidUrl(formData.lessonImage)) {
            newErrors.lessonImage = "Please enter a valid URL (e.g., https://example.com/image.jpg)"
        }

        // Validate level - must be selected
        if (!formData.level) {
            newErrors.level = "Level is required"
        }

        // Validate estimatedTime - must be a number
        if (!formData.estimatedTime.trim()) {
            newErrors.estimatedTime = "Estimated time is required"
        } else if (isNaN(formData.estimatedTime) || Number(formData.estimatedTime) <= 0) {
            newErrors.estimatedTime = "Estimated time must be a positive number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // URL validation helper
    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        // eslint-disable-next-line no-unused-vars
        } catch (_) {
            return false
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError(null)
        setSubmitSuccess(false)

        // Validate form
        if (!validateForm()) {
            return
        }

        try {
            setSubmitLoading(true)
            
            // Prepare data for API
            const lessonData = {
                lessonTitle: formData.lessonTitle.trim(),
                lessonImage: formData.lessonImage.trim(),
                level: formData.level,
                estimatedTime: Number(formData.estimatedTime),
                isCompleted: formData.isCompleted
            }

            // Submit to API (PUT request for update)
            const response = await fetch(`https://68fe2a877c700772bb12feec.mockapi.io/SE151037/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(lessonData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log("Lesson updated successfully:", result)
            
            setSubmitSuccess(true)
            
            // Redirect to all lessons after success
            setTimeout(() => {
                navigate("/AllLesson")
            }, 2000)

        } catch (err) {
            console.error("Error updating lesson:", err)
            setSubmitError(err.message)
        } finally {
            setSubmitLoading(false)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        navigate("/AllLesson")
    }

    // Loading state while fetching lesson data
    if (loading) {
        return (
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        <Card className="shadow-sm">
                            <Card.Body className="text-center p-5">
                                <Spinner animation="border" role="status" className="mb-3">
                                    <span className="visually-hidden">Loading lesson data...</span>
                                </Spinner>
                                <p>Loading lesson data...</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }

    // Error state if failed to fetch lesson data
    if (fetchError) {
        return (
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        <Alert variant="danger">
                            <Alert.Heading>Error Loading Lesson</Alert.Heading>
                            <p>Failed to load lesson data: {fetchError}</p>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Button variant="outline-danger" onClick={() => navigate("/AllLesson")}>
                                    Back to All Lessons
                                </Button>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-warning text-dark">
                            <h3 className="mb-0">
                                <i className="bi bi-pencil-square me-2"></i>
                                Edit Lesson #{id}
                            </h3>
                        </Card.Header>
                        
                        <Card.Body className="p-4">
                            {/* Success Alert */}
                            {submitSuccess && (
                                <Alert variant="success">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    Lesson updated successfully! Redirecting to all lessons...
                                </Alert>
                            )}

                            {/* Error Alert */}
                            {submitError && (
                                <Alert variant="danger">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Error updating lesson: {submitError}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                {/* Lesson Title */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="bi bi-type me-1"></i>
                                        Lesson Title *
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lessonTitle"
                                        value={formData.lessonTitle}
                                        onChange={handleChange}
                                        placeholder="e.g., Kanji Master"
                                        isInvalid={!!errors.lessonTitle}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lessonTitle}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        Must contain more than 1 word
                                    </Form.Text>
                                </Form.Group>

                                {/* Lesson Image URL */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="bi bi-image me-1"></i>
                                        Lesson Image URL *
                                    </Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="lessonImage"
                                        value={formData.lessonImage}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        isInvalid={!!errors.lessonImage}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lessonImage}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        Must be a valid URL starting with http:// or https://
                                    </Form.Text>
                                </Form.Group>

                                {/* Level Select */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="bi bi-bar-chart-line me-1"></i>
                                        Level *
                                    </Form.Label>
                                    <Form.Select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        isInvalid={!!errors.level}
                                    >
                                        <option value="">Select a level...</option>
                                        {levelOptions.map(level => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.level}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Estimated Time */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <i className="bi bi-clock me-1"></i>
                                        Estimated Time (minutes) *
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="estimatedTime"
                                        value={formData.estimatedTime}
                                        onChange={handleChange}
                                        placeholder="e.g., 45"
                                        min="1"
                                        isInvalid={!!errors.estimatedTime}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.estimatedTime}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        Must be a positive number
                                    </Form.Text>
                                </Form.Group>

                                {/* Is Completed Switch */}
                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="switch"
                                        name="isCompleted"
                                        checked={formData.isCompleted}
                                        onChange={handleChange}
                                        label={
                                            <span>
                                                <i className="bi bi-check-circle me-1"></i>
                                                Mark as completed
                                            </span>
                                        }
                                        id="isCompletedSwitch"
                                    />
                                </Form.Group>

                                {/* Action Buttons */}
                                <div className="d-flex gap-3 justify-content-end">
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={handleCancel}
                                        disabled={submitLoading}
                                    >
                                        <i className="bi bi-x-circle me-1"></i>
                                        Cancel
                                    </Button>
                                    
                                    <Button
                                        type="submit"
                                        variant="warning"
                                        disabled={submitLoading}
                                        className="px-4"
                                    >
                                        {submitLoading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    className="me-2"
                                                />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-1"></i>
                                                Update Lesson
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default EditLesson