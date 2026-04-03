import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { id: Number, past: Boolean }

  open(event) {
    event.preventDefault()

    const path = this.element.dataset.deletePath
    document.getElementById('modal-delete-link').setAttribute('href', path)
    document.getElementById('modal-delete-warning').classList.toggle('fr-hidden', !this.pastValue)
    document.getElementById('modal-delete-confirm').classList.toggle('fr-hidden', this.pastValue)

    document.getElementById('fr-modal-delete-trigger').click()
  }
}
