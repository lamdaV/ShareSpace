import React, { Component } from "react";
import { 
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Jumbotron,
  Row,
  UncontrolledTooltip
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
      toHome: false
    }

    this.createErrorMessage = this.createErrorMessage.bind(this);
    this.createBreadCrumb = this.createBreadCrumb.bind(this);
    this.createFilesCard = this.createFilesCard.bind(this);
    this.createDropzone = this.createDropzone.bind(this);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

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
                    file={file}
                    id={index}/>
          <br/>
        </Col>
      </Row>
    );
  }

  createDropzone() {
    return (
      <Row>
        <Col>
          <Jumbotron>
            <Dropzone onDrop={this.handleDrop} style={{textAlign: "center", width: "auto"}} id={`dropzone${this.props.id}`}>
              <h1> <GoPlus/> </h1>
            </Dropzone>
            <UncontrolledTooltip placement="bottom" target={`dropzone${this.props.id}`}>
              Drop-and-drop files here or click to add
            </UncontrolledTooltip>
          </Jumbotron>
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
          const errors = error.response.data.errors.map((err) => err.msg);
          this.setState({errors: errors});
        }
      });
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
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data;
          this.setState({errors: [errors]});
        }
      });
  }

  handleDrop(files) {
    const path = qs.parse(this.props.location.search).path;
    files.forEach((file) => {
      this.props.service.upload(file, path)
        .then((res) => this.listFiles(path))
        .catch((error) => {
          if (error.response) {
            const errors = error.response.data.errors.map((err) => err.msg);
            this.setState({errors});
          }
        });
    });
  }

  listFiles(path = null) {
    this.props.service.listFiles(path)
      .then((res) => res.data)
      .then((data) => this.setState({errors: [], breadcrumb: data.breadcrumb, files: data.files}))
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data.errors.map((err) => err.msg);
          this.setState({errors});
        }
      });
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

    let dropzone = this.createDropzone();

    return (
      <Container>
        {messages}
        {breadcrumb}
        {files}
        {dropzone}
      </Container>
    );
  }
}

export default User;