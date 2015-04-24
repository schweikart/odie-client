import ko from "knockout";

import config from "../config";
import Document from "./document";

export default class DocumentList {
  constructor() {
    this.lecture = '';
    this.lectureFilter = '';
    this.examinantsFilter = '';
    this.typeFilter = '';
    this.documents = [];
    ko.track(this);
    ko.getObservable(this, 'lecture').subscribe(newName => this.load(newName));
    ko.defineProperty(this, 'encodedLecture', {
      get: encodeURIComponent,
      set: decodeURIComponent
    });
  }

  load(name) {
    this.lecture = name;
    if (name)
      config.getJSON('/data/lectures/' + encodeURIComponent(name) + '/documents')
        .done(data => this.documents = data.map(d => new Document(d)));
    else
      this.documents = [];
  }

  filtered() {
    let examinantsRegex = new RegExp(this.examinantsFilter, 'i');
    let lectureRegex = new RegExp(this.lectureFilter, 'i');
    return this.documents.filter(d =>
      (this.typeFilter === '' || this.typeFilter === d.examType) &&
      (this.examinantsFilter === '' || examinantsRegex.test(d.examinants.join(' '))) &&
      (this.lectureFilter === '' || lectureRegex.test(d.lectures.join(' ')))
    );
  }

  toggleTypeFilter(type) {
    if (!this.typeFilter || type !== this.typeFilter)
      this.typeFilter = type;
    else
      this.typeFilter = '';
  }

  countType(type) {
    return this.filtered().filter(doc => doc.examType === type).length;
  }
}
