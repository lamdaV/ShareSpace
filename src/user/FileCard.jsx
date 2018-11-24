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
import { 
  GoArchive,
  GoCircleSlash,
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
      fileName: this.props.file.name,
      rename: <GoPencil/>,
      cancel: <GoCircleSlash/>,
      save: <GoArchive/>,
      open: <GoFileSymlinkDirectory/>,
      download: <GoCloudDownload/>,
      delete: <GoTrashcan/>
    };

    this.createRenameControl = this.createRenameControl.bind(this);
    this.createFolderControl = this.createFolderControl.bind(this);
    this.createFileControl = this.createFileControl.bind(this);

    this.handleRename = this.handleRename.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleInput = this.handleInput.bind(this);

    this.showButtonLabel = this.showButtonLabel.bind(this);
    this.hideButtonLabel = this.hideButtonLabel.bind(this);
  }

  createRenameControl() {
    return (
      <Row>
        <Col>
          <Button block 
                  color="success" 
                  onClick={this.handleSave}
                  onMouseOver={(event) => this.showButtonLabel(event, "save")}
                  onMouseOut={(event) => this.hideButtonLabel(event, "save")}>
            {this.state.save}
          </Button>
        </Col>
        <Col>
          <Button block 
                  color="danger" 
                  onClick={this.handleCancel}
                  onMouseOver={(event) => this.showButtonLabel(event, "cancel")}
                  onMouseOut={(event) => this.hideButtonLabel(event, "cancel")}>
            {this.state.cancel}
          </Button>
        </Col>
      </Row>
    );
  }

  createFolderControl() {
    const linkTo = `/user?path=${this.props.file.path_display}`;
    return (
      <Row>
        <Col>
          <Button block 
                  color="primary" 
                  tag={Link} 
                  to={linkTo}
                  onMouseOver={(event) => this.showButtonLabel(event, "open")}
                  onMouseOut={(event) => this.hideButtonLabel(event, "open")}>
            {this.state.open}
          </Button>
        </Col>
        <Col>
          <Button block
                    color="warning" 
                    onClick={this.handleRename} 
                    onMouseOver={(event) => this.showButtonLabel(event, "rename")}
                    onMouseOut={(event) => this.hideButtonLabel(event, "rename")}>
            {this.state.rename}
          </Button>
        </Col>
        <Col>
          <Button block 
                  color="danger"
                  onClick={() => this.props.handleDelete(this.props.file)}
                  onMouseOver={(event) => this.showButtonLabel(event, "delete")}
                  onMouseOut={(event) => this.hideButtonLabel(event, "delete")}>
            {this.state.delete}
          </Button>    
        </Col>
      </Row>
    );
  }

  createFileControl() {
    return (
      <Row>
        <Col>
          <Button block
                  color="primary" 
                  onClick={() => this.props.handleDownload(this.props.file)}
                  onMouseOver={(event) => this.showButtonLabel(event, "download")}
                  onMouseOut={(event) => this.hideButtonLabel(event, "download")}>
            {this.state.download}
          </Button>
        </Col>
        <Col>
          <Button block
                  color="warning" 
                  onClick={this.handleRename} 
                  onMouseOver={(event) => this.showButtonLabel(event, "rename")}
                  onMouseOut={(event) => this.hideButtonLabel(event, "rename")}>
            {this.state.rename}
          </Button>
        </Col>
        <Col>
          <Button block 
                  color="danger"
                  onClick={() => this.props.handleDelete(this.props.file)}
                  onMouseOver={(event) => this.showButtonLabel(event, "delete")}
                  onMouseOut={(event) => this.hideButtonLabel(event, "delete")}>
            {this.state.delete}
          </Button>    
        </Col>
      </Row>
    );
  }

  handleRename(event) {
    event.preventDefault();
    this.setState({renameToggle: true});
  }

  handleCancel(event) {
    event.preventDefault();
    this.setState({renameToggle: false, fileName: this.props.file.name});
  }

  handleSave(event) {
    event.preventDefault();
    this.setState({renameToggle: false});
    this.props.handleSave(this.props.file, this.state.fileName);
  }

  handleInput(event) {
    event.preventDefault();
    this.setState({fileName: event.currentTarget.value});
  }

  showButtonLabel(event, type) {
    event.preventDefault();
    switch (type) {
      case "rename":
        this.setState({rename: "Rename"});
        break;
      case "cancel":
        this.setState({cancel: "Cancel"});
        break;
      case "save":
        this.setState({save: "Save"});
        break;
      case "open":
        this.setState({open: "Open"});
        break;
      case "download":
        this.setState({download: "Download"});
        break;
      case "delete":
        this.setState({delete: "Delete"});
        break;
      default:
        break
    }
  }

  hideButtonLabel(event, type) {
    event.preventDefault();
    switch (type) {
      case "rename":
        this.setState({rename: <GoPencil/>});
        break;
      case "cancel":
        this.setState({cancel: <GoCircleSlash/>});
        break;
      case "save":
        this.setState({save: <GoArchive/>});
        break;
      case "open":
        this.setState({open: <GoFileSymlinkDirectory/>});
        break;
      case "download":
        this.setState({download: <GoCloudDownload/>});
        break;
      case "delete":
        this.setState({delete: <GoTrashcan/>});
        break;
      default:
        break
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.file.name !== this.props.file.name) {
      this.setState({fileName: this.props.file.name});
    }
  }

  render() {
    let controls;
    if (this.state.renameToggle) {
      controls = this.createRenameControl();
    } else if (this.props.file[".tag"] === "folder") {
      controls = this.createFolderControl();
    } else {
      controls = this.createFileControl();
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