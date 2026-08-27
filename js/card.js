document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const label     = card.querySelector('.card-label');
        const checkbox  = card.querySelector('.card-toggle');
        let isFlipped   = false;
        
        checkbox.addEventListener('change', function() {
            isFlipped = this.checked;
            if (isFlipped)  { label.style.transform = 'rotateY(180deg)';    }
            else            { label.style.transform = 'rotateY(0deg)';      }
        });
        
        label.addEventListener('mousemove', function(e) {
            if (isFlipped) return;
            
            const rect  = label.getBoundingClientRect();
            const x     = (e.clientX - rect.left) / rect.width;
            
            let rotation = 0;
            
            if      (x < 0.3)   { rotation = -30;   }
            else if (x > 0.7)   { rotation = 30;    }
            else                { rotation = 0;     }
            
            label.style.transform = `rotateY(${rotation}deg)`;
        });
        
        label.addEventListener('mouseleave', function() {
            if (!isFlipped) { label.style.transform = 'rotateY(0deg)'; }
        });
    });
});