import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
  return ['form','submitBouton','error','BtnPreview','BtnModifier','info',
  'content1','grade1','quotite1','date1','programme1','service1',
  'content2', 'grade2','quotite2','date2','programme2','service2',
  'content3','grade3','quotite3','date3','programme3','service3',
  'content4','grade4','quotite4','date4','programme4','service4',
  'content5','grade5','quotite5','date5','programme5','service5',
  'content6','grade6','quotite6','date6','programme6','service6',
  'content7','grade7','quotite7','date7','programme7','service7',
  'content8','grade8','quotite8','date8','programme8','service8',
  'content9','grade9','quotite9','date9','programme9','service9',
  'content10','grade10','quotite10','date10','programme10','service10',
  'formSuppression','BtnAddSuppression','errorAddSuppression','countSuppression','coutSuppression','coutSuppressionBase',
  'addcontent1','addgrade1','addquotite1','adddate1','addprogramme1','addservice1','addponctuel1',
  'addcontent2','addgrade2','addquotite2','adddate2','addprogramme2','addservice2','addponctuel2',
  'addcontent3','addgrade3','addquotite3','adddate3','addprogramme3','addservice3','addponctuel3',
  'addcontent4','addgrade4','addquotite4','adddate4','addprogramme4','addservice4','addponctuel4',
  'formAjout','BtnAddAjout','errorAddAjout','countAjout','coutAjout','coutAjoutBase',
  'resultSuppression','resultSuppression1','resultSuppression2','resultSuppression3','resultSuppression4','resultSuppression5','resultSuppression6','resultSuppression7','resultSuppression8','resultSuppression9','resultSuppression10',
  'resultGrade1','resultQuotite1','resultDate1','resultProgramme1','resultService1',
  'resultGrade2','resultQuotite2','resultDate2','resultProgramme2','resultService2',
  'resultGrade3','resultQuotite3','resultDate3','resultProgramme3','resultService3',
  'resultGrade4','resultQuotite4','resultDate4','resultProgramme4','resultService4',
  'resultGrade5','resultQuotite5','resultDate5','resultProgramme5','resultService5',
  'resultGrade6','resultQuotite6','resultDate6','resultProgramme6','resultService6',
  'resultGrade7','resultQuotite7','resultDate7','resultProgramme7','resultService7',
  'resultGrade8','resultQuotite8','resultDate8','resultProgramme8','resultService8',
  'resultGrade9','resultQuotite9','resultDate9','resultProgramme9','resultService9',
  'resultGrade10','resultQuotite10','resultDate10','resultProgramme10','resultService10',
  'resultAjout','resultAjout1','resultAjout2','resultAjout3','resultAjout4',
  'resultaddGrade1','resultaddQuotite1','resultaddDate1','resultaddProgramme1','resultaddService1','resultaddPonctuel1',
  'resultaddGrade2','resultaddQuotite2','resultaddDate2','resultaddProgramme2','resultaddService2','resultaddPonctuel2',
  'resultaddGrade3','resultaddQuotite3','resultaddDate3','resultaddProgramme3','resultaddService3','resultaddPonctuel3',
  'resultaddGrade4','resultaddQuotite4','resultaddDate4','resultaddProgramme4','resultaddService4','resultaddPonctuel4',
  'success',
  ];
  }
  connect() {
    
  }

  formChange(e){
    e.preventDefault();
    this.errorAddSuppressionTarget.classList.add('fr-hidden');
    this.errorAddAjoutTarget.classList.add('fr-hidden');
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
    const service_targets = [this.service1Target, this.service2Target, this.service3Target, this.service4Target, this.service5Target, this.service6Target, this.service7Target, this.service8Target, this.service9Target, this.service10Target];
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
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target,this.content7Target,this.content8Target,this.content9Target,this.content10Target];
    const grade_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target,this.grade5Target,this.grade6Target,this.grade7Target,this.grade8Target,this.grade9Target,this.grade10Target];
    const quotite_targets = [this.quotite1Target,this.quotite2Target,this.quotite3Target,this.quotite4Target,this.quotite5Target,this.quotite6Target,this.quotite7Target,this.quotite8Target,this.quotite9Target,this.quotite10Target];
    const date_targets = [this.date1Target,this.date2Target,this.date3Target,this.date4Target,this.date5Target,this.date6Target,this.date7Target,this.date8Target,this.date9Target,this.date10Target];
    const programme_targets = [this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target,this.programme5Target,this.programme6Target,this.programme7Target,this.programme8Target,this.programme9Target,this.programme10Target];
    const service_targets = [this.service1Target,this.service2Target,this.service3Target,this.service4Target,this.service5Target, this.service6Target, this.service7Target, this.service8Target, this.service9Target, this.service10Target];
    [10,9,8,7,6,5,4,3,2].forEach((indice) => {
      if (content_targets[indice-1].classList.contains('fr-hidden') && (content_targets[indice-2].classList.contains('fr-hidden')==false)){
        if (grade_targets[indice-2].selectedIndex != 0 && quotite_targets[indice-2].selectedIndex != 0 && date_targets[indice-2].value != "" && programme_targets[indice-2].selectedIndex != 0 && service_targets[indice-2].selectedIndex != 0 ){
          content_targets[indice-1].classList.remove('fr-hidden');
          if (indice == 10){
            this.BtnAddSuppressionTarget.classList.add('fr-hidden');
          }
        }
        else{
          this.errorAddSuppressionTarget.classList.remove('fr-hidden');
          this.errorAddSuppressionTarget.innerHTML = "Vous devez d'abord sélectionner tous les champs obligatoires (*) ci-dessus";
       }
      }
    });
    this.BtnPreviewTarget.classList.add('bouton_inactive');
  }

  removeEtpSuppression(e){
    e.preventDefault();
    this.errorAddSuppressionTarget.classList.add('fr-hidden');
    var id = parseInt(e.target.dataset.value);
    const arr = Array.from({length:(10-id)},(v,k)=>k+id);
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target,this.content7Target,this.content8Target,this.content9Target,this.content10Target];
    const grade_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target,this.grade5Target,this.grade6Target,this.grade7Target,this.grade8Target,this.grade9Target,this.grade10Target];
    const quotite_targets = [this.quotite1Target,this.quotite2Target,this.quotite3Target,this.quotite4Target,this.quotite5Target,this.quotite6Target,this.quotite7Target,this.quotite8Target,this.quotite9Target,this.quotite10Target];
    const date_targets = [this.date1Target,this.date2Target,this.date3Target,this.date4Target,this.date5Target,this.date6Target,this.date7Target,this.date8Target,this.date9Target,this.date10Target];
    const programme_targets = [this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target,this.programme5Target,this.programme6Target,this.programme7Target,this.programme8Target,this.programme9Target,this.programme10Target];
    const service_targets = [this.service1Target,this.service2Target,this.service3Target,this.service4Target,this.service5Target, this.service6Target, this.service7Target, this.service8Target, this.service9Target, this.service10Target];
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
    this.content10Target.classList.add('fr-hidden');
    this.BtnAddSuppressionTarget.classList.remove('fr-hidden');
    this.grade10Target.selectedIndex = 0;
    this.quotite10Target.selectedIndex = 0;
    this.date10Target.value = "";
    this.programme10Target.selectedIndex = 0;
    this.service10Target.selectedIndex = 0;
    this.formChange(e);
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
          this.errorAddAjoutTarget.innerHTML = "Vous devez d'abord sélectionner tous les champs ci-dessus";
       }
      }
    })
    this.BtnPreviewTarget.classList.add('bouton_inactive');
  }

  removeEtpAjout(e){
    e.preventDefault();
    this.errorAddAjoutTarget.classList.add('fr-hidden');
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
    this.formChange(e);
  }
  validateForm(){
    let isValid = true;
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target,this.content7Target,this.content8Target,this.content9Target,this.content10Target, this.addcontent1Target,this.addcontent2Target, this.addcontent3Target, this.addcontent4Target];
    const grade_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target,this.grade5Target,this.grade6Target,this.grade7Target,this.grade8Target,this.grade9Target,this.grade10Target, this.addgrade1Target,this.addgrade2Target,this.addgrade3Target,this.addgrade4Target];
    const quotite_targets = [this.quotite1Target,this.quotite2Target,this.quotite3Target,this.quotite4Target,this.quotite5Target,this.quotite6Target,this.quotite7Target,this.quotite8Target,this.quotite9Target,this.quotite10Target,this.addquotite1Target,this.addquotite2Target,this.addquotite3Target,this.addquotite4Target];
    const date_targets = [this.date1Target,this.date2Target,this.date3Target,this.date4Target,this.date5Target,this.date6Target,this.date7Target,this.date8Target,this.date9Target,this.date10Target,this.adddate1Target,this.adddate2Target,this.adddate3Target,this.adddate4Target];
    const programme_targets = [this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target,this.programme4Target,this.programme5Target,this.programme6Target,this.programme7Target,this.programme8Target,this.programme9Target,this.programme10Target,this.addprogramme1Target,this.addprogramme2Target,this.addprogramme3Target,this.addprogramme4Target];
    const service_targets = [this.service1Target,this.service2Target,this.service3Target,this.service4Target,this.service5Target, this.service6Target, this.service7Target, this.service8Target, this.service9Target, this.service10Target,this.addservice1Target,this.addservice2Target,this.addservice3Target,this.addservice4Target];
   [0,1,2,3,4,5,6,7,8,9,11,12,13].forEach((indice) => {
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
    const content_targets = [this.content1Target,this.content2Target,this.content3Target,this.content4Target,this.content5Target,this.content6Target,this.content7Target,this.content8Target,this.content9Target,this.content10Target, this.addcontent1Target,this.addcontent2Target, this.addcontent3Target, this.addcontent4Target];
    const resultContent_targets = [this.resultSuppression1Target, this.resultSuppression2Target, this.resultSuppression3Target, this.resultSuppression4Target,this.resultSuppression5Target,this.resultSuppression6Target,this.resultSuppression7Target,this.resultSuppression8Target,this.resultSuppression9Target,this.resultSuppression10Target, this.resultAjout1Target, this.resultAjout2Target,this.resultAjout3Target,this.resultAjout4Target ];

    
    const form_targets = [this.grade1Target,this.grade2Target,this.grade3Target,this.grade4Target,this.grade5Target,this.grade6Target,this.grade7Target,this.grade8Target,this.grade9Target,this.grade10Target,this.quotite1Target,this.quotite2Target,this.quotite3Target,this.quotite4Target,this.quotite5Target,this.quotite6Target,this.quotite7Target,this.quotite8Target,this.quotite9Target,this.quotite10Target,this.date1Target,this.date2Target,this.date3Target,this.date4Target,this.date5Target,this.date6Target,this.date7Target,this.date8Target,this.date9Target,this.date10Target,this.programme1Target,this.programme2Target,this.programme3Target,this.programme4Target,this.programme5Target,this.programme6Target,this.programme7Target,this.programme8Target,this.programme9Target,this.programme10Target,this.service1Target,this.service2Target,this.service3Target,this.service4Target,this.service5Target, this.service6Target, this.service7Target, this.service8Target, this.service9Target, this.service10Target,
    this.addgrade1Target,this.addgrade2Target,this.addgrade3Target,this.addgrade4Target, this.addquotite1Target,this.addquotite2Target,this.addquotite3Target,this.addquotite4Target,this.adddate1Target,this.adddate2Target,this.adddate3Target,this.adddate4Target,this.addprogramme1Target,this.addprogramme2Target,this.addprogramme3Target,this.addprogramme4Target,this.addservice1Target,this.addservice2Target,this.addservice3Target,this.addservice4Target];
    const result_targets = [this.resultGrade1Target,this.resultGrade2Target,this.resultGrade3Target,this.resultGrade4Target,this.resultGrade5Target,this.resultGrade6Target,this.resultGrade7Target,this.resultGrade8Target,this.resultGrade9Target,this.resultGrade10Target, this.resultQuotite1Target,this.resultQuotite2Target,this.resultQuotite3Target,this.resultQuotite4Target,this.resultQuotite5Target,this.resultQuotite6Target,this.resultQuotite7Target,this.resultQuotite8Target,this.resultQuotite9Target,this.resultQuotite10Target,this.resultDate1Target,this.resultDate2Target,this.resultDate3Target,this.resultDate4Target,this.resultDate5Target,this.resultDate6Target,this.resultDate7Target,this.resultDate8Target,this.resultDate9Target,this.resultDate10Target,this.resultProgramme1Target,this.resultProgramme2Target,this.resultProgramme3Target,this.resultProgramme4Target,this.resultProgramme5Target,this.resultProgramme6Target,this.resultProgramme7Target,this.resultProgramme8Target,this.resultProgramme9Target,this.resultProgramme10Target,this.resultService1Target,this.resultService2Target,this.resultService3Target,this.resultService4Target,this.resultService5Target,this.resultService6Target,this.resultService7Target,this.resultService8Target,this.resultService9Target,this.resultService10Target,
    this.resultaddGrade1Target,this.resultaddGrade2Target,this.resultaddGrade3Target,this.resultaddGrade4Target, this.resultaddQuotite1Target,this.resultaddQuotite2Target,this.resultaddQuotite3Target,this.resultaddQuotite4Target,this.resultaddDate1Target,this.resultaddDate2Target,this.resultaddDate3Target,this.resultaddDate4Target,this.resultaddProgramme1Target,this.resultaddProgramme2Target,this.resultaddProgramme3Target,this.resultaddProgramme4Target,this.resultaddService1Target,this.resultaddService2Target,this.resultaddService3Target,this.resultaddService4Target];
    const ponctuel_targets = [ this.addponctuel1Target,this.addponctuel2Target,this.addponctuel3Target,this.addponctuel4Target];
    const result_ponctuel_targets = [this.resultaddPonctuel1Target,this.resultaddPonctuel2Target,this.resultaddPonctuel3Target,this.resultaddPonctuel4Target]
    const arr = Array.from({length:(60)},(v,k)=>k);
    if (isValid == true) {
      this.formSuppressionTarget.classList.add('fr-hidden');
      this.resultSuppressionTarget.classList.remove('fr-hidden');
      this.formAjoutTarget.classList.add('fr-hidden');
      this.resultAjoutTarget.classList.remove('fr-hidden');
      this.BtnPreviewTarget.classList.add('fr-hidden');
      this.BtnModifierTarget.classList.remove('fr-hidden');
      this.submitBoutonTarget.classList.remove('fr-hidden');
      this.countAjoutTarget.innerHTML = "1"; // on met 1 par defaut et apres si jamais n'a pas rempli on met à 0
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13].forEach((indice) => {
        if (content_targets[indice].classList.contains('fr-hidden') == false){
          resultContent_targets[indice].classList.remove('fr-hidden');
          if (indice <= 9){
            this.countSuppressionTarget.innerHTML = (indice+1).toString() ;
          }else {
            this.countAjoutTarget.innerHTML = (indice-9).toString() ;
          }
        }else {
          resultContent_targets[indice].classList.add('fr-hidden');
        }

      })
      if (this.addgrade1Target.selectedIndex == 0 || this.addquotite1Target.selectedIndex == 0 || this.addprogramme1Target.selectedIndex == 0 || this.addservice1Target.selectedIndex == 0 || this.adddate1Target.value == ""){
        resultContent_targets[10].classList.add('fr-hidden');
        this.countAjoutTarget.innerHTML = "0";
      }else{
        resultContent_targets[10].classList.remove('fr-hidden');
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
      });
      this.infoTarget.classList.add('fr-hidden');
      // mettre à jour les couts 
      const token = document.querySelector('meta[name="csrf-token"]').content;
      const url = "/repere3/get_couts";
      const grades = [this.grade1Target.value, this.grade2Target.value, this.grade3Target.value, this.grade4Target.value, this.grade5Target.value, this.grade6Target.value, this.grade7Target.value, this.grade8Target.value, this.grade9Target.value, this.grade10Target.value];
      const addgrades = [this.addgrade1Target.value, this.addgrade2Target.value, this.addgrade3Target.value, this.addgrade4Target.value];
      const programmes = [this.programme1Target.value, this.programme2Target.value, this.programme3Target.value, this.programme4Target.value, this.programme5Target.value, this.programme6Target.value, this.programme7Target.value, this.programme8Target.value, this.programme9Target.value, this.programme10Target.value];
      const addprogrammes = [this.addprogramme1Target.value, this.addprogramme2Target.value, this.addprogramme3Target.value, this.addprogramme4Target.value];
      const quotites = [this.quotite1Target.value, this.quotite2Target.value, this.quotite3Target.value, this.quotite4Target.value, this.quotite5Target.value, this.quotite6Target.value, this.quotite7Target.value, this.quotite8Target.value, this.quotite9Target.value, this.quotite10Target.value];
      const addquotites = [this.addquotite1Target.value, this.addquotite2Target.value, this.addquotite3Target.value, this.addquotite4Target.value];
      const dates = [this.date1Target.value, this.date2Target.value, this.date3Target.value, this.date4Target.value, this.date5Target.value, this.date6Target.value, this.date7Target.value, this.date8Target.value, this.date9Target.value, this.date10Target.value];
      const adddates = [this.adddate1Target.value, this.adddate2Target.value, this.adddate3Target.value, this.adddate4Target.value];
      const ponctuel = [this.addponctuel1Target.checked, this.addponctuel2Target.checked, this.addponctuel3Target.checked, this.addponctuel4Target.checked];
      
      const body = {grades: grades, addgrades: addgrades,programmes: programmes, addprogrammes: addprogrammes, quotites: quotites, addquotites: addquotites, dates: dates, adddates: adddates, ponctuel: ponctuel};
      
      console.log(body);
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
          this.coutSuppressionTarget.innerHTML = (data.cout_supp_gestion).toString();
          this.coutAjoutTarget.innerHTML = (data.cout_add_gestion).toString();
          this.coutSuppressionBaseTarget.innerHTML = (data.cout_supp_base).toString();
          this.coutAjoutBaseTarget.innerHTML = (data.cout_add_base).toString();
          if (Math.abs(data.cout_supp_base) < data.cout_add_base){
            this.errorTarget.classList.remove('fr-hidden');
          }else {
            this.successTarget.classList.remove('fr-hidden');
          }
      })

    }else {
      // mettre en rouge les champs non remplis  
    }
  }

  modifier(e){
    e.preventDefault();
    this.formSuppressionTarget.classList.remove('fr-hidden');
    this.resultSuppressionTarget.classList.add('fr-hidden');
    this.formAjoutTarget.classList.remove('fr-hidden');
    this.resultAjoutTarget.classList.add('fr-hidden');
    this.BtnPreviewTarget.classList.remove('fr-hidden');
    this.BtnModifierTarget.classList.add('fr-hidden');
    this.submitBoutonTarget.classList.add('fr-hidden');
    this.infoTarget.classList.remove('fr-hidden');
    this.errorTarget.classList.add('fr-hidden');
    this.successTarget.classList.add('fr-hidden');
  }

  replaceHtml(form, result){
    if (form.value == ""){
        result.innerHTML = "∅";
    }else{
        result.innerHTML = form.value;
    }
  }


}
function getSelectedValues(event) {
        return [...event.target.selectedOptions].map(option => option.value)
    }