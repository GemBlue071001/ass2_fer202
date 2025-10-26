import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap"

const AddLesson = () => {
    const navigate = useNavigate()
    
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
    const [loading, setLoading] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Level options
    const levelOptions = ["N1", "N2", "N3", "N4", "N5"]

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

    // Validation functions
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
            setLoading(true)
            
            // Prepare data for API
            const lessonData = {
                lessonTitle: formData.lessonTitle.trim(),
                lessonImage: formData.lessonImage.trim(),
                level: formData.level,
                estimatedTime: Number(formData.estimatedTime),
                isCompleted: formData.isCompleted
            }

            // Submit to API
            const response = await fetch("https://68fe2a877c700772bb12feec.mockapi.io/SE151037", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(lessonData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log("Lesson created successfully:", result)
            
            setSubmitSuccess(true)
            
            // Redirect to all lessons after success
            setTimeout(() => {
                navigate("/AllLesson")
            }, 2000)

        } catch (err) {
            console.error("Error creating lesson:", err)
            setSubmitError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Reset form
    const handleReset = () => {
        setFormData({
            lessonTitle: "",
            lessonImage: "",
            level: "",
            estimatedTime: "",
            isCompleted: false
        })
        setErrors({})
        setSubmitError(null)
        setSubmitSuccess(false)
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col lg={8} xl={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h3 className="mb-0">
                                <i className="bi bi-plus-circle me-2"></i>
                                Add New Lesson
                            </h3>
                        </Card.Header>
                        
                        <Card.Body className="p-4">
                            {/* Success Alert */}
                            {submitSuccess && (
                                <Alert variant="success">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    Lesson created successfully! Redirecting to all lessons...
                                </Alert>
                            )}

                            {/* Error Alert */}
                            {submitError && (
                                <Alert variant="danger">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Error creating lesson: {submitError}
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
                                    <Form.Text className="text-muted">
                                        Default is set to false (not completed)
                                    </Form.Text>
                                </Form.Group>

                                {/* Action Buttons */}
                                <div className="d-flex gap-3 justify-content-end">
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                        Reset
                                    </Button>
                                    
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading}
                                        className="px-4"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    className="me-2"
                                                />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle me-1"></i>
                                                Add Lesson
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

export default AddLesson