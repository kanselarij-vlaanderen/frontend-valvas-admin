import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';
import { task } from 'ember-concurrency-decorators';
import fetch from 'fetch';

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

  get error() {
    if (isBlank(this.sessionId)) {
      return "Geef een zitting UUID in";
    } else if (this.isEnabledDocumentNotification) {
      if (isBlank(this.sessionDate) || isBlank(this.documentPublicationDateTime)) {
        return "Geef de nodige datums voor de document notificatie in";
      }
    }
    return null;
  }

  @task
  *triggerExport(body) {
    const response = yield fetch(`/export/${this.sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('Something went wrong while exporting the session');
    }
  }

  @task
  *publish() {
    const scope = this.scopes.filter(scope => scope.includeInExport).map(scope => scope.value);
    if (scope.includes('documents')) {
      if (!scope.includes('news-items'))
        scope.push('news-items');
      if (!scope.includes('announcements'))
        scope.push('announcements');
    }

    const body = { scope };

    if (this.isEnabledDocumentNotification) {
      body.documentNotification = {
        sessionDate: this.sessionDate,
        documentPublicationDateTime: this.documentPublicationDateTime
      };
    }

    yield this.triggerExport.perform(body);
  }

  @task
  *unpublish() {
    const body = { scope: [] };
    yield this.triggerExport.perform(body);
  }
}
