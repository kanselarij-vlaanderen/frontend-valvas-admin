import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

class ExportScope {
  @tracked label;
  @tracked value;
  @tracked includeInExport;

  constructor({ label, value, includeInExport }) {
    this.label = label;
    this.value = value;
    this.includeInExport = includeInExport;
  }
}

export default class IndexController extends Controller {
  scopes = [
    new ExportScope({ label: 'Nieuwsberichten', value: 'news-items', includeInExport: true }),
    new ExportScope({ label: 'Mededelingen', value: 'announcements', includeInExport: true }),
    new ExportScope({ label: 'Documenten', value: 'documents', includeInExport: false })
  ];

  constructor() {
    super(...arguments);
    this.documentNotification = false;
    this.documentPublicationDateTime = '';
    this.sessionDate = '';
    this.previewNotification = false;
  }

  @action
  exportZitting() {
    const scope = this.scopes.findAll(scope => scope.includeInExport).map(scope => scope.value);
    const body = { scope };
    if (this.documentNotification) {
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
