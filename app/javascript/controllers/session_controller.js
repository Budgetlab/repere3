import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
  return ['form','statut','region','regionBloc','ministere','ministereBloc','password','submitBouton','error',
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
    this.errorTarget.classList.add('fr-hidden');
    const targets = [this.statutTarget, this.regionTarget, this.ministereTarget, this.passwordTarget];
    targets.forEach((element) =>{
      element.classList.remove('fr-select--error');
      element.parentNode.classList.remove('fr-select-group--error');
    });
  }

  submitForm(e){
    let valid = true;
    if (this.passwordTarget.value == ""){
      valid = false;
      this.passwordTarget.classList.add('fr-select--error');
      this.passwordTarget.parentNode.classList.add('fr-select-group--error');
    }
    if (this.statutTarget.value == "" ){
      valid = false;
      this.statutTarget.classList.add('fr-select--error');
      this.statutTarget.parentNode.classList.add('fr-select-group--error');
    }
    if ((this.statutTarget.value == "CBR" || this.statutTarget.value == "prefet") && this.regionTarget.value == ""){
      valid = false;
      this.regionTarget.classList.add('fr-select--error');
      this.regionTarget.parentNode.classList.add('fr-select-group--error');

    }else if (this.statutTarget.value == "ministere" && this.ministereTarget.value == ""){
      valid = false;
      this.ministereTarget.classList.add('fr-select--error');
      this.ministereTarget.parentNode.classList.add('fr-select-group--error');
    }
    if (valid == false ){
      this.errorTarget.classList.remove('fr-hidden');
      this.errorTarget.innerHTML = "Vous devez remplir tous les champs obligatoires (*)";
      e.preventDefault();
    }
  }

  resultForm(event){
    if (event.detail.success == false){
      this.errorTarget.classList.remove('fr-hidden');
      this.errorTarget.innerHTML = "Mot de passe incorrect";
      this.passwordTarget.classList.add('fr-select--error');
      this.passwordTarget.parentNode.classList.add('fr-select-group--error');
    } 
  }
}
