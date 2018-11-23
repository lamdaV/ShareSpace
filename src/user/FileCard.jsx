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
  Row,
  UncontrolledTooltip
} from "reactstrap";
import { Link } from "react-router-dom";
import { 
  GoArchive,
  GoCloudDownload,
  GoPencil,
  GoFileSymlinkDirectory,
  GoTrashcan
} from "react-icons/go";

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
    const renameTarget = `renameButton${this.props.id}`;
    if (this.state.renameToggle) {
      const saveTarget = `saveButton${this.props.id}`;
      controls = (
        <Row>
          <Col>
            <Button block 
                    color="success" 
                    onClick={this.handleSave}
                    id={saveTarget}>
              <GoArchive/>
            </Button>
            <UncontrolledTooltip placement="top" target={saveTarget}>
              Save
            </UncontrolledTooltip>
          </Col>
        </Row>
      )
    } else if (this.props.file[".tag"] === "folder") {
      const linkTo = `/user?path=${this.props.file.path_display}`;
      const openTarget = `openButton${this.props.id}`;
      controls = (
        <Row>
          <Col>
            <Button block 
                    color="primary" 
                    tag={Link} 
                    to={linkTo}
                    id={openTarget}>
              <GoFileSymlinkDirectory/>
            </Button>
            <UncontrolledTooltip placement="top" target={openTarget}>
              Open
            </UncontrolledTooltip>
          </Col>
          <Col>
            <Button block
                      color="warning" 
                      onClick={() => this.handleRename()} 
                      id={renameTarget}>
                <GoPencil/>
            </Button>
            <UncontrolledTooltip placement="top" target={renameTarget}>
              Rename
            </UncontrolledTooltip>
          </Col>  
        </Row>
      )
    } else {
      const downloadTarget = `downloadButton${this.props.id}`;
      const deleteTarget = `deleteButton${this.props.id}`;
      controls = (
        <Row>
          <Col>
            <Button block
                    color="primary" 
                    onClick={() => this.props.handleDownload(this.props.file)}
                    id={downloadTarget}>
              <GoCloudDownload/>
            </Button>
            <UncontrolledTooltip placement="top" target={downloadTarget}>
              Download
            </UncontrolledTooltip>
          </Col>
          <Col>
            <Button block
                    color="warning" 
                    onClick={() => this.handleRename()} 
                    id={renameTarget}>
              <GoPencil/>
            </Button>
            <UncontrolledTooltip placement="top" target={renameTarget}>
              Rename
            </UncontrolledTooltip>
          </Col>
          <Col>
            <Button block 
                    color="danger"
                    onClick={() => this.props.handleDelete(this.props.file)}
                    id={deleteTarget}>
              <GoTrashcan/>
            </Button>
            <UncontrolledTooltip placement="top" target={deleteTarget}>
              Delete
            </UncontrolledTooltip>
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
          &nbsp;
          {this.props.file.size ? <Badge color="primary">size={this.props.file.size}B</Badge> : null}
          &nbsp;
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