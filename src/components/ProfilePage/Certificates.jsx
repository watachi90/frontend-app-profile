import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Col, Card, CardBody, CardTitle, Button, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import messages from './Certificates.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { certificatesSelector } from '../../selectors/ProfilePageSelector';

class Certificates extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.props.changeHandler(this.props.formId, name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  renderCertificate({
    type: { name }, title, organization, downloadUrl,
  }) {
    return (
      <Col key={downloadUrl} sm={6}>
        <Card className="mb-4 certificate">
          <CardBody>
            <CardTitle>
              <p className="small mb-0">{name}</p>
              <h4 className="certificate-title">{title}</h4>
            </CardTitle>
            <p className="small mb-0">From</p>
            <h6 className="mb-4">{organization}</h6>
            <div>
              <Button outline color="primary" href={downloadUrl} target="blank">
                <FontAwesomeIcon className="ml-n1 mr-2" icon={faDownload} />
                Download
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }

  renderCertificates() {
    if (this.props.certificates === null) {
      return null;
    }

    return (
      <Row>{this.props.certificates.map(certificate => this.renderCertificate(certificate))}</Row>
    );
  }

  render() {
    const {
      formId, visibility, editMode, saveState, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <Form onSubmit={this.handleSubmit}>
              <EditableItemHeader content={intl.formatMessage(messages['profile.certificates.my.certificates'])} />
              {this.renderCertificates()}
              <FormControls
                formId={formId}
                saveState={saveState}
                visibility={visibility}
                cancelHandler={this.handleClose}
                changeHandler={this.handleChange}
              />
            </Form>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.certificates.my.certificates'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibility !== null}
                visibility={visibility}
              />
              {this.renderCertificates()}
            </React.Fragment>
          ),
          empty: (
            <div>
              <FormattedMessage
                id="profile.no.certificates"
                defaultMessage="You don't have any certificates yet."
                description="displays when user has no course completion certificates"
              />
            </div>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content={intl.formatMessage(messages['profile.certificates.my.certificates'])} />
              {this.renderCertificates()}
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

Certificates.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  certificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

Certificates.defaultProps = {
  editMode: 'static',
  saveState: null,
  visibility: 'private',
  certificates: null,
};

export default connect(
  certificatesSelector,
  {},
)(injectIntl(Certificates));
