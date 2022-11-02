import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
  return ['form','submitBouton','error','BtnPreview','BtnModifier',
  'content1','grade1','quotite1','date1','programme1','service1',
  'content2', 'grade2','quotite2','date2','programme2','service2',
  'content3','grade3','quotite3','date3','programme3','service3',
  'content4','grade4','quotite4','date4','programme4','service4',
  'formSuppression','BtnAddSuppression','errorAddSuppression','countSuppression','coutSuppression',
  'addcontent1','addgrade1','addquotite1','adddate1','addprogramme1','addservice1','addponctuel1',
  'addcontent2','addgrade2','addquotite2','adddate2','addprogramme2','addservice2','addponctuel2',
  'addcontent3','addgrade3','addquotite3','adddate3','addprogramme3','addservice3','addponctuel3',
  'addcontent4','addgrade4','addquotite4','adddate4','addprogramme4','addservice4','addponctuel4',
  'formAjout','BtnAddAjout','errorAddAjout','countAjout','coutAjout',
  'resultSuppression','resultSuppression1','resultSuppression2','resultSuppression3','resultSuppression4',
  'resultGrade1','resultQuotite1','resultDate1','resultProgramme1','resultService1',
  'resultGrade2','resultQuotite2','resultDate2','resultProgramme2','resultService2',
  'resultGrade3','resultQuotite3','resultDate3','resultProgramme3','resultService3',
  'resultGrade4','resultQuotite4','resultDate4','resultProgramme4','resultService4',
  'resultAjout','resultAjout1','resultAjout2','resultAjout3','resultAjout4',
  'resultaddGrade1','resultaddQuotite1','resultaddDate1','resultaddProgramme1','resultaddService1','resultaddPonctuel1',
  'resultaddGrade2','resultaddQuotite2','resultaddDate2','resultaddProgramme2','resultaddService2','resultaddPonctuel2',
  'resultaddGrade3','resultaddQuotite3','resultaddDate3','resultaddProgramme3','resultaddService3','resultaddPonctuel3',
  'resultaddGrade4','resultaddQuotite4','resultaddDate4','resultaddProgramme4','resultaddService4','resultaddPonctuel4',

  ];
  }
  connect() {
    
  }
  submitForm(e){
  }

  resultForm(event){
    if (event.detail.success == false){
    } 
  }
  formChange(e){
    e.preventDefault();
    this.errorAddSuppressionTarget.classList.add('fr-hidden');
    let isValid = this.validateForm(this.formTarget);
    if (isValid == true){
      this.BtnPreviewTarget.classList.remove('bouton_inactive');
    } else {
      this.BtnPreviewTarget.classList.add('bouton_inactive');
    }

  }
  programmeChange(e){
    // adapter la liste de services en fonction du programme choisi 
    e.preventDefault();
    var id = event.target.dataset.value; //numero ef 
    const programme = getSelectedValues(event)[0];
    const service_targets = [this.service1Target, this.service2Target, this.service3Target, this.service4Target];
    this.resetChamp(service_targets[id-1]);    
    // mettre à jour les niveaux  
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const url = "/repere3/select_services";
    const body = { programme }
    fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(body),
      credentials: "include",
      dataType: 'script',
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
    })
    .then(response => response.json()/*response.text()*/)
    .then(data => {
        data.services.forEach((service) => {
        const opt = document.createElement("option");
        opt.value = service;
        opt.innerHTML = service;
        service_targets[id-1].appendChild(opt);
        })
    }) 
}

  programmeChangeAjout(e){
    // adapter la liste de services en fonction du programme choisi 
    e.preventDefault();
    var id = event.target.dataset.value; //numero ef 
    const programme = getSelectedValues(event)[0];
    const service_targets = [this.addservice1Target, this.addservice2Target, this.addservice3Target, this.addservice4Target];
    this.resetChamp(service_targets[id-1]);    
        // mettre à jour les niveaux  
        const token = document.querySelector('meta[name="csrf-token"]').content;
        const url = "/repere3/select_services";
        const body = { programme }
        fetch(url, { 
          method: 'POST', 
          body: JSON.stringify(body),
          credentials: "include",
          dataType: 'script',
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          },
        })
        .then(response => response.json()/*response.text()*/)
        .then(data => {
            data.services.forEach((service) => {
            const opt = document.createElement("option");
            opt.value = service;
            opt.innerHTML = service;
            service_targets[id-1].appendChild(opt);
            })
        }) 
  }

  resetChamp(target){
        target.innerHTML = "";
        const option = document.createElement("option");
        option.value = "";
        option.innerHTML = "- sélectionner -";
        target.appendChild(option);
    }

  addSuppression(e){
    // doit remplir tous les champs avant de pouvoir ajouter 
    e.preventDefault();
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target];
    const grade_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target];
    const quotite_targets = [this.quotite1Target,this.quotite2Target,this.quotite3Target,this.quotite4Target];
    const date_targets = [this.date1Target,this.date2Target,this.date3Target,this.date4Target];
    const programme_targets = [this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target];
    const service_targets = [this.service1Target,this.service2Target,this.service3Target,this.service4Target];
    [4,3,2].forEach((indice) => {
      if (content_targets[indice-1].classList.contains('fr-hidden') && (content_targets[indice-2].classList.contains('fr-hidden')==false)){
        if (grade_targets[indice-2].selectedIndex != 0 && quotite_targets[indice-2].selectedIndex != 0 && date_targets[indice-2].value != "" && programme_targets[indice-2].selectedIndex != 0 && service_targets[indice-2].selectedIndex != 0 ){
          content_targets[indice-1].classList.remove('fr-hidden');
          if (indice == 4){
            this.BtnAddSuppressionTarget.classList.add('fr-hidden');
          }
        }
        else{
          this.errorAddSuppressionTarget.classList.remove('fr-hidden');
          this.errorAddSuppressionTarget.innerHTML = "Vous devez d'abord sélectionner tous les champs obligatoires (*) ci-dessus";
       }
      }
    })
  }

  removeEtpSuppression(e){
    e.preventDefault();
    this.errorAddSuppressionTarget.classList.add('fr-hidden');
    var id = parseInt(e.target.dataset.value);
    const arr = Array.from({length:(4-id)},(v,k)=>k+id);
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target];
    const grade_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target];
    const quotite_targets = [this.quotite1Target,this.quotite2Target,this.quotite3Target,this.quotite4Target];
    const date_targets = [this.date1Target,this.date2Target,this.date3Target,this.date4Target];
    const programme_targets = [this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target];
    const service_targets = [this.service1Target,this.service2Target,this.service3Target,this.service4Target];
    arr.forEach((indice) => {
          if (content_targets[indice].classList.contains('fr-hidden') == false) { // si celui dapres etait ouvert on switch 
            grade_targets[indice-1].value = grade_targets[indice].value;
            quotite_targets[indice-1].value = quotite_targets[indice].value;
            date_targets[indice-1].value = date_targets[indice].value;
            programme_targets[indice-1].value = programme_targets[indice].value;
            var service_1 = service_targets[indice].value;
            // mettre à jour les services  
            this.resetChamp(service_targets[indice-1]);  
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const url = "/repere3/select_services";
            const programme = programme_targets[indice-1].value;
            const body = { programme };
            fetch(url, { 
              method: 'POST', 
              body: JSON.stringify(body),
              credentials: "include",
              dataType: 'script',
              headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
              },
            })
            .then(response => response.json()/*response.text()*/)
            .then(data => {
                data.services.forEach((service) => {
                const opt = document.createElement("option");
                opt.value = service;
                opt.innerHTML = service;
                opt.selected = service === service_1;
                service_targets[indice-1].appendChild(opt);
                })
            }) 
            service_targets[indice-1].value = service_targets[indice].value; 
          }else{
            content_targets[indice-1].classList.add('fr-hidden');
            grade_targets[indice-1].selectedIndex = 0;
            quotite_targets[indice-1].selectedIndex = 0;
            date_targets[indice-1].value = "";
            programme_targets[indice-1].selectedIndex = 0;
            service_targets[indice-1].selectedIndex = 0;
          }
    })
    this.content4Target.classList.add('fr-hidden');
    this.BtnAddSuppressionTarget.classList.remove('fr-hidden');
    this.grade4Target.selectedIndex = 0;
    this.quotite4Target.selectedIndex = 0;
    this.date4Target.value = "";
    this.programme4Target.selectedIndex = 0;
    this.service4Target.selectedIndex = 0;
  }

  addAjout(e){
    e.preventDefault();
    const content_targets = [this.addcontent1Target,this.addcontent2Target,this.addcontent3Target,this.addcontent4Target];
    const grade_targets = [this.addgrade1Target,this.addgrade2Target,this.addgrade3Target,this.addgrade4Target];
    const quotite_targets = [this.addquotite1Target,this.addquotite2Target,this.addquotite3Target,this.addquotite4Target];
    const date_targets = [this.adddate1Target,this.adddate2Target,this.adddate3Target,this.adddate4Target];
    const programme_targets = [this.addprogramme1Target,this.addprogramme2Target,this.addprogramme3Target,this.addprogramme4Target];
    const service_targets = [this.addservice1Target,this.addservice2Target,this.addservice3Target,this.addservice4Target];
    [4,3,2].forEach((indice) => {
      if (content_targets[indice-1].classList.contains('fr-hidden') && (content_targets[indice-2].classList.contains('fr-hidden')==false)){
        if (grade_targets[indice-2].selectedIndex != 0 && quotite_targets[indice-2].selectedIndex != 0 && date_targets[indice-2].value != "" && programme_targets[indice-2].selectedIndex != 0 && service_targets[indice-2].selectedIndex != 0 ){
          content_targets[indice-1].classList.remove('fr-hidden');
          if (indice == 4){
            this.BtnAddAjoutTarget.classList.add('fr-hidden');
          }
        }
        else{
          this.errorAddAjoutTarget.classList.remove('fr-hidden');
          this.errorAddAjoutTarget.innerHTML = "Vous devez d'abord sélectionner tous les champs obligatoires (*) ci-dessus";
       }
      }
    })
  }

  removeEtpAjout(e){
    e.preventDefault();
    this.errorAddSuppressionTarget.classList.add('fr-hidden');
    var id = parseInt(e.target.dataset.value);
    const arr = Array.from({length:(4-id)},(v,k)=>k+id);
    const content_targets = [this.addcontent1Target,this.addcontent2Target,this.addcontent3Target,this.addcontent4Target];
    const grade_targets = [this.addgrade1Target,this.addgrade2Target,this.addgrade3Target,this.addgrade4Target];
    const quotite_targets = [this.addquotite1Target,this.addquotite2Target,this.addquotite3Target,this.addquotite4Target];
    const date_targets = [this.adddate1Target,this.adddate2Target,this.adddate3Target,this.adddate4Target];
    const programme_targets = [this.addprogramme1Target,this.addprogramme2Target,this.addprogramme3Target,this.addprogramme4Target];
    const service_targets = [this.addservice1Target,this.addservice2Target,this.addservice3Target,this.addservice4Target];
    arr.forEach((indice) => {
          if (content_targets[indice].classList.contains('fr-hidden') == false) { // si celui dapres etait ouvert on switch 
            grade_targets[indice-1].value = grade_targets[indice].value;
            quotite_targets[indice-1].value = quotite_targets[indice].value;
            date_targets[indice-1].value = date_targets[indice].value;
            programme_targets[indice-1].value = programme_targets[indice].value;
            var service_1 = service_targets[indice].value;
            // mettre à jour les services  
            this.resetChamp(service_targets[indice-1]);  
            const token = document.querySelector('meta[name="csrf-token"]').content;
            const url = "/repere3/select_services";
            const programme = programme_targets[indice-1].value;
            const body = { programme };
            fetch(url, { 
              method: 'POST', 
              body: JSON.stringify(body),
              credentials: "include",
              dataType: 'script',
              headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
              },
            })
            .then(response => response.json()/*response.text()*/)
            .then(data => {
                data.services.forEach((service) => {
                const opt = document.createElement("option");
                opt.value = service;
                opt.innerHTML = service;
                opt.selected = service === service_1;
                service_targets[indice-1].appendChild(opt);
                })
            }) 
            service_targets[indice-1].value = service_targets[indice].value; 
          }else{
            content_targets[indice-1].classList.add('fr-hidden');
            grade_targets[indice-1].selectedIndex = 0;
            quotite_targets[indice-1].selectedIndex = 0;
            date_targets[indice-1].value = "";
            programme_targets[indice-1].selectedIndex = 0;
            service_targets[indice-1].selectedIndex = 0;
          }
    })
    this.addcontent4Target.classList.add('fr-hidden');
    this.BtnAddAjoutTarget.classList.remove('fr-hidden');
    this.addgrade4Target.selectedIndex = 0;
    this.addquotite4Target.selectedIndex = 0;
    this.adddate4Target.value = "";
    this.addprogramme4Target.selectedIndex = 0;
    this.addservice4Target.selectedIndex = 0;
  }
  validateForm(){
    let isValid = true;
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target, this.addcontent1Target,this.addcontent2Target, this.addcontent3Target, this.addcontent4Target];
    const grade_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target, this.addgrade1Target,this.addgrade2Target,this.addgrade3Target,this.addgrade4Target];
    const quotite_targets = [this.quotite1Target,this.quotite2Target,this.quotite3Target,this.addquotite4Target,this.addquotite1Target,this.addquotite2Target,this.addquotite3Target,this.addquotite4Target];
    const date_targets = [this.date1Target,this.date2Target,this.date3Target,this.date4Target,this.adddate1Target,this.adddate2Target,this.adddate3Target,this.adddate4Target];
    const programme_targets = [this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target,this.addprogramme1Target,this.addprogramme2Target,this.addprogramme3Target,this.addprogramme4Target];
    const service_targets = [this.service1Target,this.service2Target,this.service3Target,this.service4Target,this.addservice1Target,this.addservice2Target,this.addservice3Target,this.addservice4Target];
   [0,1,2,3,5,6,7].forEach((indice) => {
      if (content_targets[indice].classList.contains('fr-hidden') == false){
        if (grade_targets[indice].selectedIndex == 0 || quotite_targets[indice].selectedIndex == 0 || programme_targets[indice].selectedIndex == 0 || service_targets[indice].selectedIndex == 0 || date_targets[indice].value == ""){
          isValid = false;         
        }
      }
    })
    if (this.addgrade1Target.selectedIndex != 0 || this.addquotite1Target.selectedIndex != 0 || this.addprogramme1Target.selectedIndex != 0 || this.addservice1Target.selectedIndex != 0 || this.adddate1Target.value != "" ){     
      if (this.addgrade1Target.selectedIndex == 0 || this.addquotite1Target.selectedIndex == 0 || this.addprogramme1Target.selectedIndex == 0 || this.addservice1Target.selectedIndex == 0 || this.adddate1Target.value == "" ){
        isValid = false;
      }
    }
    return isValid
  }
  preview(e){
    e.preventDefault();
    let isValid = this.validateForm(this.formTarget);
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target, this.addcontent1Target,this.addcontent2Target, this.addcontent3Target, this.addcontent4Target];
    const resultContent_targets = [this.resultSuppression1Target, this.resultSuppression2Target, this.resultSuppression3Target, this.resultSuppression4Target, this.resultAjout1Target, this.resultAjout2Target,this.resultAjout3Target,this.resultAjout4Target ];

    
    const form_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target, this.quotite1Target,this.quotite2Target,this.quotite3Target,this.quotite4Target,this.date1Target,this.date2Target,this.date3Target,this.date4Target,this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target,this.service1Target,this.service2Target,this.service3Target,this.service4Target,
    this.addgrade1Target,this.addgrade2Target,this.addgrade3Target,this.addgrade4Target, this.addquotite1Target,this.addquotite2Target,this.addquotite3Target,this.addquotite4Target,this.adddate1Target,this.adddate2Target,this.adddate3Target,this.adddate4Target,this.addprogramme1Target,this.addprogramme2Target,this.addprogramme3Target,this.addprogramme4Target,this.addservice1Target,this.addservice2Target,this.addservice3Target,this.addservice4Target];
    const result_targets = [this.resultGrade1Target,this.resultGrade2Target,this.resultGrade3Target,this.resultGrade4Target, this.resultQuotite1Target,this.resultQuotite2Target,this.resultQuotite3Target,this.resultQuotite4Target,this.resultDate1Target,this.resultDate2Target,this.resultDate3Target,this.resultDate4Target,this.resultProgramme1Target,this.resultProgramme2Target,this.resultProgramme3Target,this.resultProgramme4Target,this.resultService1Target,this.resultService2Target,this.resultService3Target,this.resultService4Target,
    this.resultaddGrade1Target,this.resultaddGrade2Target,this.resultaddGrade3Target,this.resultaddGrade4Target, this.resultaddQuotite1Target,this.resultaddQuotite2Target,this.resultaddQuotite3Target,this.resultaddQuotite4Target,this.resultaddDate1Target,this.resultaddDate2Target,this.resultaddDate3Target,this.resultaddDate4Target,this.resultaddProgramme1Target,this.resultaddProgramme2Target,this.resultaddProgramme3Target,this.resultaddProgramme4Target,this.resultaddService1Target,this.resultaddService2Target,this.resultaddService3Target,this.resultaddService4Target];
    const ponctuel_targets = [ this.addponctuel1Target,this.addponctuel2Target,this.addponctuel3Target,this.addponctuel4Target];
    const result_ponctuel_targets = [this.resultaddPonctuel1Target,this.resultaddPonctuel2Target,this.resultaddPonctuel3Target,this.resultaddPonctuel4Target]
    const arr = Array.from({length:(40)},(v,k)=>k);
    if (isValid == true) {
      this.formSuppressionTarget.classList.add('fr-hidden');
      this.resultSuppressionTarget.classList.remove('fr-hidden');
      this.formAjoutTarget.classList.add('fr-hidden');
      this.resultAjoutTarget.classList.remove('fr-hidden');
      this.BtnPreviewTarget.classList.add('fr-hidden');
      this.BtnModifierTarget.classList.remove('fr-hidden');
      this.submitBoutonTarget.classList.remove('fr-hidden');
      this.countAjoutTarget.innerHTML = "1"; // on met 1 par defaut et apres si jamais n'a pas rempli on met à 0
      [0,1,2,3,5,6,7].forEach((indice) => {
        if (content_targets[indice].classList.contains('fr-hidden') == false){
          resultContent_targets[indice].classList.remove('fr-hidden');
          if (indice <= 3){
            this.countSuppressionTarget.innerHTML = (indice+1).toString() ;
          }else {
            this.countAjoutTarget.innerHTML = (indice-3).toString() ;
          }
        }else {
          resultContent_targets[indice].classList.add('fr-hidden');
        }

      })
      if (this.addgrade1Target.selectedIndex == 0 || this.addquotite1Target.selectedIndex == 0 || this.addprogramme1Target.selectedIndex == 0 || this.addservice1Target.selectedIndex == 0 || this.adddate1Target.value == ""){
        resultContent_targets[4].classList.add('fr-hidden');
        this.countAjoutTarget.innerHTML = "0";
      }else{
        resultContent_targets[4].classList.remove('fr-hidden');
      }
      arr.forEach((indice)=>{
        this.replaceHtml(form_targets[indice], result_targets[indice]);
      });
      [0,1,2,3].forEach((indice) => {
        if (ponctuel_targets[indice].checked == true){
          result_ponctuel_targets[indice].innerHTML = "Oui";
        }else{
          result_ponctuel_targets[indice].innerHTML = "Non";
        }
      })

    }else {
      // mettre en rouge les champs non remplis  
    }
  }

  modifier(e){
    this.formSuppressionTarget.classList.remove('fr-hidden');
    this.resultSuppressionTarget.classList.add('fr-hidden');
    this.formAjoutTarget.classList.remove('fr-hidden');
    this.resultAjoutTarget.classList.add('fr-hidden');
    this.BtnPreviewTarget.classList.remove('fr-hidden');
    this.BtnModifierTarget.classList.add('fr-hidden');
    this.submitBoutonTarget.classList.add('fr-hidden');
  }

  replaceHtml(form, result){
    if (form.value == ""){
        result.innerHTML = "∅";
    }else{
        result.innerHTML = form.value;
    }
  }

  delete(e){
    var id = event.target.dataset.value; //numero ef 
    console.log(id);
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const url = "/repere3/suppression";
    const body = { id }
    fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(body),
      credentials: "include",
      dataType: 'script',
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
    })
    .then(response => response.json()/*response.text()*/)
    .then(console.log('suppression effectuée')) 
  }

}
function getSelectedValues(event) {
        return [...event.target.selectedOptions].map(option => option.value)
    }