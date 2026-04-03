import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr"
import "flatpickr/dist/l10n/fr.js"
// create a new Stimulus controller by extending stimulus-flatpickr wrapper controller
export default class extends Controller {
  static targets = []

  connect() {
    const modal   = document.getElementById('picker-container')
    const minDate = this.element.dataset.flatpickrMinDate || null
    const maxDate = this.element.dataset.flatpickrMaxDate || null

    const options = {
      locale: 'fr',
      dateFormat: "d/m/Y",
      minDate: minDate,
      maxDate: maxDate,
    }

    if (modal != null) options.appendTo = modal

    flatpickr(this.element, options)
  }

}