import React, { Component } from "react";
import { 
  Badge, 
  Button, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Col, 
  Input,
  Row
} from "reactstrap";
import { Link } from "react-router-dom";

class FileCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renameToggle: false,
      fileName: this.props.file.name
    }

    this.handleRename = this.handleRename.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleRename() {
    this.setState({renameToggle: true});
  }

  handleSave() {
    this.setState({renameToggle: false});
    this.props.handleSave(this.props.file, this.state.fileName);
  }

  handleInput(event) {
    event.preventDefault();
    this.setState({fileName: event.currentTarget.value});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.file.name !== this.props.file.name) {
      this.setState({fileName: this.props.file.name});
    }
  }

  render() {
    let controls;
    if (this.state.renameToggle) {
      controls = (
        <Row>
          <Col>
            <Button block color="success" onClick={this.handleSave}>Save</Button>
          </Col>
        </Row>
      )
    } else if (this.props.file[".tag"] === "folder") {
      const linkTo = `/user?path=${this.props.file.path_display}`;
      controls = (
        <Row>
          <Col>
            <Button block color="primary" tag={Link} to={linkTo}>Open</Button>
          </Col>
          <Col>
            <Button block color="warning" onClick={() => this.handleRename()}>Rename</Button>
          </Col>
        </Row>
      )
    } else {
      controls = (
        <Row>
          <Col>
            <Button block color="primary" onClick={() => this.props.handleDownload(this.props.file)}>Download</Button>
          </Col>
          <Col>
            <Button block color="warning" onClick={() => this.handleRename()}>Rename</Button>
          </Col>
          <Col>
            <Button block color="danger" onClick={() => this.props.handleDelete(this.props.file)}>Delete</Button>
          </Col>
        </Row>
      );
    }

    let header;
    if (this.state.renameToggle) {
      header = (<Input placeholder={this.state.fileName} onChange={this.handleInput}/>);
    } else {
      header = this.state.fileName;
    }

    return (
      <Card>
        <CardHeader>
          {header}
        </CardHeader>
        <CardBody>
          {this.props.file[".tag"] ? <Badge color="info">tag={this.props.file[".tag"]}</Badge> : null}
          {this.props.file.size ? <Badge color="primary">size={this.props.file.size}B</Badge> : null}
          {this.props.file.client_modified ? <Badge color="warning">mod={new Date(this.props.file.client_modified).toUTCString()}</Badge> : null}
        </CardBody>
        <CardFooter>
          {controls}
        </CardFooter>
      </Card>
    )
  }
}

export default FileCard;