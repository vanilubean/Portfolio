document.addEventListener('DOMContentLoaded', function() {
    // select email buttons
    const emailButtons = document.querySelectorAll('.email .button');
    
    emailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = 'estose.jericagrace@gmail.com';
            
            navigator.clipboard.writeText(email).then(() => {
                // Show feedback
                const originalText = this.textContent;
                this.textContent = '[ Copied ]';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopy(email);
            });
        });
    });
});

// FOR OLD BROWSERS
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}