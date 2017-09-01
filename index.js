(function() {
  const $form = document.getElementById('myForm')
  const $fio = $form.elements.fio
  const $email = $form.elements.email
  const $phone = $form.elements.phone
  const $submitButton = document.getElementById('submitButton')
  const $result = document.getElementById('resultContainer')
  const PHONE_REGEX = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/
  const NUM_OF_PHONE = /\D+/g
  const YANDEX_DOMAINS = [
    'ya.ru',
    'yandex.ru',
    'yandex.ua',
    'yandex.by',
    'yandex.kz',
    'yandex.com',
  ]

  windows.MyForm = {
    validate() {
      var fio = $fio.value
      var email = $email.value
      var phone = $phone.value
      var errorFields = []
      var numOfPhone = phone.replace(NUM_OF_PHONE, '').split('')
      var sumPhoneNumber = 0

      const hasSpaces = (string) => /\s/.test(string)
      const isYandexDomain = (domain) => YANDEX_DOMAINS.indexOf(domain) !== -1

      function validateEmail(email) {
        const emailParts = email.split('@')
        const login = emailParts[0]
        const domain = emailParts[1]

        return (
          emailParts.length === 2 &&
          login &&
          domain &&
          isYandexDomain(domain) &&
          !hasSpaces(login)
        )
      }

      if (fio.trim().split(/\s+/).length !== 3) {
        errorFields.push('fio')
      }

      if (!validateEmail(email)) {
        errorFields.push('email')
      }

      if (PHONE_REGEX.test(phone.trim())) {
        for (var i of numOfPhone) {
          sumPhoneNumber = sumPhoneNumber + Number(numOfPhone[i])
          if (sumPhoneNumber > 30){
            errorFields.push('phone')
          }
        }
      } else {
        errorFields.push('phone')
      }

      return {
        isValid: errorFields.length === 0,
        errorFields: errorFields
      }

    },


    getData() {
      return {
        fio: $fio.value,
        email: $email.value,
        phone: $phone.value,
      }
    },


    setData(data) {
      $fio.value = data.fio
      $email.value = data.email
      $phone.value = data.phone
    },


    submit() {
      const {isValid, errorFields} = MyForm.validate()

      if (isValid) {
        $submitButton.disabled = false
        submitForm()
      } else {
        errorFields.forEach(field => {
          $form.elements[field].classList.add('error')
        })
      }
    }
  }





  function sumitForm() {
    ajaxSubmit(MyForm.getData(), response => {
      switch (response.status) {
        case 'success':
          $result.classList.add('success')
          $result.innerText = 'Success'
          break

        case 'error':
          $result.classList.add('error')
          $result.innerText = result.reason
          break

        case 'progress':
          $result.classList.add('progress')
          setTimeout(sumitForm, response.timeout)
          break
      }
    })
  }

  function ajaxSubmit(data, callback) {
    callback({ status: 'success' })
    // { status: 'success' }
    // { status: 'error', reason }
    // { status: 'progress', timeout: 1000 }
  }
})()
