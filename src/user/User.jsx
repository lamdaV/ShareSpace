import React, { Component } from "react";
import { 
  Button,
  Container,
  ListGroup,
  ListGroupItem,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Nav
} from "reactstrap";
import { Redirect } from "react-router-dom";
import { saveAs } from "file-saver";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      breadcrumb: [],
      files: [],
      errors: [],
      toHome: false
    }

    this.createErrorMessage = this.createErrorMessage.bind(this);
    this.createBreadCrumb = this.createBreadCrumb.bind(this);
    this.createFilesCard = this.createFilesCard.bind(this);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.listFiles = this.listFiles.bind(this);
  };

  createErrorMessage(error, index) {
    return (
      <ListGroupItem key={`error ${index}`} color="danger">{error}</ListGroupItem>
    );
  }

  createBreadCrumb(breadcrumb, index, list) {
    return (
      <BreadcrumbItem key={`bread ${index}`} active={index === list.length - 1}>{breadcrumb}</BreadcrumbItem>
    );
  }

  createFilesCard(file, index) {
    let controls;
    if (file[".tag"] === "folder") {
      controls = (
        <Row>
          <Col>
            <Button block color="primary" onClick={() => this.handleOpen(file)}>Open</Button>
          </Col>
        </Row>
      )
    } else {
      controls = (
        <Row>
          <Col>
            <Button block color="primary" onClick={() => this.handleDownload(file)}>Download</Button>
          </Col>
          <Col>
            <Button block color="warning">Rename</Button>
          </Col>
          <Col>
            <Button block color="danger" onClick={() => this.handleDelete(file)}>Delete</Button>
          </Col>
        </Row>
      );
    }
    
    return (
      <Row key={`file ${index}`}>
        <Col>
          <Card>
            <CardHeader>{file.name}</CardHeader>
            <CardBody>
              {file[".tag"] ? <Badge color="info">{file[".tag"]}</Badge> : null}
              {file.size ? <Badge color="primary">{file.size}B</Badge> : null}
              {file.client_modified ? <Badge color="warning">{new Date(file.client_modified).toUTCString()}</Badge> : null}
            </CardBody>
            <CardFooter>
              {controls}
            </CardFooter>
          </Card>
        </Col>
      </Row>
    );
  }

  handleOpen(file) {
    this.listFiles(file.path_display);
  }

  handleDownload(file) {
    this.props.service.download(file.path_display)
      .then((res) => res.data)
      .then((data) => saveAs(new Blob([data]), file.name))
      .catch((error) => this.setState({errors: [error.message]}))
  }

  handleDelete(file) {
    this.props.service.delete(file.path_display)
      .then((res) => this.listFiles(file.path_display.substring(0, file.path_display.lastIndexOf("/"))))
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data;
          this.setState({errors: [errors]});
        }
      });
  }

  listFiles(path = null) {
    this.props.service.listFiles(path)
      .then((res) => res.data)
      .then((data) => this.setState({errors: [], breadcrumb: data.breadcrumb, files: data.files}))
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
          const errors = error.response.data.errors.map((err) => err.msg);
          this.setState({errors});
        }
      });
  }

  componentDidMount() {
    this.props.service.verify()
      .then((res) => {
        this.props.store.publish("auth", true);
        this.listFiles();
      })
      .catch((error) => this.setState({toHome: true}));
  }

  render() {
    if (this.state.toHome) {
      return (<Redirect to="/"/>);
    }
    let messages = null
    if (this.state.errors.length > 0) {
      messages = (
        <Row>
          <Col>
            <ListGroup>
              {this.state.errors.map(this.createErrorMessage)}
            </ListGroup>
          </Col>
        </Row>
      )
    }

    let breadcrumb = null;
    if (this.state.breadcrumb.length > 0) {
      breadcrumb = (
        <Row>
          <Col>
            <Breadcrumb>
              {this.state.breadcrumb.map(this.createBreadCrumb)}
            </Breadcrumb>
          </Col>
        </Row>
      )
    }
    
    let files = null;
    if (this.state.files.length > 0) {
      files = this.state.files.map(this.createFilesCard);
    }


    return (
      <Container>
        {messages}
        {breadcrumb}
        {files}
      </Container>
    );
  }
}

export default User;