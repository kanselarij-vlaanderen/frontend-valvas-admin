import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  constructor() {
    super(...arguments);
    this.zittingId = '';
    this.exportType = 'all';
    this.documentNotification = false;
    this.documentPublicationDateTime = '';
    this.sessionDate = '';
    this.previewNotification = false;
    this.scopes = {
      'news-items': ['news-items'],
      'announcements': ['announcements'],
      'news-items-and-announcements' : [ 'news-items', 'announcements' ],
      'all' : [ 'news-items', 'announcements', 'documents' ]
    };
  }

  @action
  exportZitting() {
    const body= {
      scope: this.scopes[this.exportType]
    };
    if(this.documentNotification) {
      body.documentNotification = {
        sessionDate: this.sessionDate,
        documentPublicationDateTime: this.documentPublicationDateTime
      };
    }
    fetch(`/export/${this.zittingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }

  updateZittingId(value) {
    this.set('zittingId', value);
  }

  updateDocumentNotification(value) {
    this.set('documentNotification', value);
  }

  updateSessionDate(value) {
    this.set('sessionDate', value);
  }

  updateDocumentPublicationDateTime(value) {
    this.set('documentPublicationDateTime', value);
  }

  updatePreviewNotification(value) {
    this.set('previewNotification', value);
  }

}
