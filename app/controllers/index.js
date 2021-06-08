import Controller from '@ember/controller';
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
    new ExportScope({ label: 'Documenten', value: 'documents', includeInExport: false })
  ];

  @tracked sessionId;

  get error() {
    if (isBlank(this.sessionId)) {
      return "Geef een zitting UUID in";
    } else {
      return null;
    }
  }

  @task
  *publish() {
    const scope = this.scopes.filter(scope => scope.includeInExport).map(scope => scope.value);
    if (scope.includes('documents') && !scope.includes('news-items')) {
      scope.push('news-items');
    }

    const response = yield fetch(`/meetings/${this.sessionId}/publication-activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          type: 'publication-activity',
          attributes: {
            scope: scope
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Something went wrong while exporting the session');
    }
  }

  @task
  *unpublish() {
    this.scopes.forEach(scope => scope.includeInExport = false);
    yield this.publish.perform();
  }
}
