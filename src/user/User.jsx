import React, { Component } from "react";
import { 
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  UncontrolledTooltip,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { saveAs } from "file-saver";
import qs from "query-string";
import FileCard from "./FileCard";
import Dropzone from "react-dropzone";
import {
  GoPlus
} from "react-icons/go";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      breadcrumb: [],
      files: [],
      errors: [],
      toHome: false,
      directoryName: ""
    };

    this.createErrorMessage = this.createErrorMessage.bind(this);
    this.createBreadCrumb = this.createBreadCrumb.bind(this);
    this.createFilesCard = this.createFilesCard.bind(this);
    this.createDirectoryCreator = this.createDirectoryCreator.bind(this);
    this.createDropzone = this.createDropzone.bind(this);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDirectoryInput = this.handleDirectoryInput.bind(this);
    this.handleCreateDirectory = this.handleCreateDirectory.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleErrors = this.handleErrors.bind(this);

    this.listFiles = this.listFiles.bind(this);
  };

  createErrorMessage(error, index) {
    return (
      <ListGroupItem key={`error ${index}`} color="danger">{error}</ListGroupItem>
    );
  }

  createBreadCrumb(breadcrumb, index, list) {
    const crumb = list.slice(0, index + 1);
    const path = `/user?path=${crumb.join("/")}`;
    const active = index === list.length - 1;
    return (
      <BreadcrumbItem tag={Link} to={path} key={`bread ${index}`} active={active}>
        {breadcrumb}
      </BreadcrumbItem>
    );
  }

  createFilesCard(file, index) {
    return (
      <Row key={`file ${index}`}>
        <Col>
          <FileCard handleOpen={this.handleOpen} 
                    handleDownload={this.handleDownload} 
                    handleDelete={this.handleDelete}
                    handleSave={this.handleSave}
                    file={file}/>
          <br/>
        </Col>
      </Row>
    );
  }

  createDirectoryCreator() {
    return (
      <Row>
        <Col>
          <InputGroup>
            <Input placeholder="directory name" value={this.state.directoryName} onChange={this.handleDirectoryInput}/>
            <InputGroupAddon addonType="append">
              <Button onClick={this.handleCreateDirectory} color="success" disabled={this.state.directoryName.length < 1}>
                <GoPlus/>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <br/>
        </Col>
      </Row>
    );
  }

  createDropzone() {
    const id = `dropzone${Date.now()}`;
    return (
      <Row>
        <Col>
          <Button block color="primary">
            <Dropzone onDrop={this.handleDrop} style={{textAlign: "center", width: "auto"}} id={id}>
              <h1> <GoPlus/> </h1>
            </Dropzone>
            <UncontrolledTooltip placement="bottom" target={id}>
              Drop-and-drop files here or click to add
            </UncontrolledTooltip>
          </Button>
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
      .catch(this.handleErrors);
  }

  handleSave(file, newName) {
    const oldPath = file.path_display.split("/");
    oldPath[oldPath.length - 1] = newName;
    const newPath = oldPath.join("/");
    this.props.service.rename(file.path_display, newPath)
      .then((res) => res.data)
      .then((data) => {
        const path = data.metadata.path_display.split("/");
        this.listFiles(path.slice(0, path.length - 1).join("/"))
      })
      .catch(this.handleErrors);
  }

  handleDirectoryInput(event) {
    event.preventDefault();
    this.setState({directoryName: event.currentTarget.value});
  }

  handleCreateDirectory(event) {
    event.preventDefault();
    const path = qs.parse(this.props.location.search).path;
    this.props.service.createDirectory(path, this.state.directoryName)
      .then((res) => {
        this.setState({directoryName: ""});
        this.listFiles(path);
      })
      .catch(this.handleErrors);
  }

  handleDrop(files) {
    const path = qs.parse(this.props.location.search).path;
    files.forEach((file) => {
      this.props.service.upload(file, path)
        .then((res) => this.listFiles(path))
        .catch(this.handleErrors);
    });
  }

  listFiles(path = null) {
    this.props.service.listFiles(path)
      .then((res) => res.data)
      .then((data) => this.setState({errors: [], breadcrumb: data.breadcrumb, files: data.files}))
      .catch(this.handleErrors);
  }

  handleErrors(error) {
    if (error.response) {
      const errors = error.response.data.errors.map((err) => err.msg);
      this.setState({errors});
    }
  }

  componentDidMount() {
    this.props.service.verify()
      .then((res) => {
        this.props.store.publish("auth", true);
        const queries = qs.parse(this.props.location.search);
        if (queries.path) {
          this.listFiles(queries.path);
        } else {
          this.listFiles();
        }
      })
      .catch((error) => {
        this.props.store.publish("auth", false);
        this.setState({toHome: true});
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.location.search !== this.props.location.search) {
      const queries = qs.parse(this.props.location.search);
      if (queries.path) {
        this.listFiles(queries.path);
      }
    }
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
            <br/>
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
          <br/>
        </Row>
      )
    }
    
    let files = null;
    if (this.state.files.length > 0) {
      files = this.state.files.map(this.createFilesCard);
    }

    let directoryCreator = this.createDirectoryCreator();
    let dropzone = this.createDropzone();

    return (
      <Container>
        {messages}
        {breadcrumb}
        {files}
        {directoryCreator}
        {dropzone}
      </Container>
    );
  }
}

export default User;