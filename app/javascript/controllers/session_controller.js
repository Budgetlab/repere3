import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
  return ['form','statut','region','regionBloc','ministere','ministereBloc','password','submitBouton','error','error2','credentials'
  ];
  }
  connect() {
    
  }

  statutChange(e){
    e.preventDefault();
    if (this.statutTarget.value == "admin" || this.statutTarget.value == "" ){
      this.regionBlocTarget.classList.add('fr-hidden');
      this.ministereBlocTarget.classList.add('fr-hidden');
      this.regionTarget.selectedIndex = 0;
      this.ministereTarget.selectedIndex = 0;
    }else if (this.statutTarget.value == "ministere"){
      this.regionBlocTarget.classList.add('fr-hidden');
      this.ministereBlocTarget.classList.remove('fr-hidden');
      this.regionTarget.selectedIndex = 0;
    }else if (this.statutTarget.value == "CBR" || this.statutTarget.value == "prefet"){
      this.regionBlocTarget.classList.remove('fr-hidden');
      this.ministereBlocTarget.classList.add('fr-hidden');
      this.ministereTarget.selectedIndex = 0;
      this.regionTarget.selectedIndex = 0;
    }
  }
  changeForm(e){
    e.preventDefault();
    this.error2Target.classList.add('fr-hidden');
    this.errorTarget.classList.add('fr-hidden');
    this.credentialsTarget.classList.remove('fr-fieldset--error');

  }

  submitForm(e){
    let valid = true;
    if (this.passwordTarget.value == ""){
      valid = false;
    }
    if (this.statutTarget.value == "" ){
      valid = false;
    }
    if ((this.statutTarget.value == "CBR" || this.statutTarget.value == "prefet") && this.regionTarget.value == ""){
      valid = false;

    }else if (this.statutTarget.value == "ministere" && this.ministereTarget.value == ""){
      valid = false;
    }
    if (valid == false ){
      this.error2Target.classList.remove('fr-hidden');
      this.credentialsTarget.classList.add('fr-fieldset--error');
      e.preventDefault();
    }
  }

  resultForm(event){
    if (event.detail.success == false){
      this.errorTarget.classList.remove('fr-hidden');
      this.credentialsTarget.classList.add('fr-fieldset--error');
    } 
  }
}
