import React, {useState} from "react";
import { Form, Button, ListGroup } from "react-bootstrap";

const MultipleFileUpload = ({ files, setFiles }) => {
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = [...files];

    newFiles.forEach((file) => {
      if (file.size > 1024 * 1024 * 10) {
        setError("File size should be less than 10MB");
      } else if (updatedFiles.length > 10) {
        setError("You can only upload 10 files max! Zip them if you need to upload more.");
      } else {
        setError(null);
        updatedFiles.push(file);
      }      
    });

    setFiles(updatedFiles);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Form.Group controlId="fileUpload">
        <Form.Label>Upload Files</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileChange} />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </Form.Group>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      {error && <p className="text-danger text-small">{error}</p>}
      {files.length > 0 && (
        <ListGroup>
          {files.map((file, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {index+1} - {file.name} - {(file.size / 1048576).toFixed(2)}MB
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeFile(index)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default MultipleFileUpload;
