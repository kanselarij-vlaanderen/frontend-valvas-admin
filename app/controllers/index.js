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

  @tracked sessionId;
  @tracked isEnabledDocumentNotification = false;
  @tracked sessionDate;
  @tracked documentPublicationDateTime;

  }

  @action
  exportSession() {
    const scope = this.scopes.filter(scope => scope.includeInExport).map(scope => scope.value);
    const body = { scope };
    if (this.isEnabledDocumentNotification) {
      body.documentNotification = {
        sessionDate: this.sessionDate,
        documentPublicationDateTime: this.documentPublicationDateTime
      };
    }
    fetch(`/export/${this.sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
}
