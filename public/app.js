document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form')
  form.addEventListener('submit', (e)=> {
    e.preventDefault()
    const newPassword = e.currentTarget.new_password.value
    const passwordConfirmation = e.currentTarget.password_confirmation.value
    
  })
});