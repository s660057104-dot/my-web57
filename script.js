document.addEventListener('DOMContentLoaded', () => {
    initAdvancedCards();   // ระบบการ์ด 3D
    initMenuEffect();      // เมนูแบบมีลูกเล่น
    initScrollReveal();    // เอฟเฟกต์การ์ดลอยขึ้น
});

/* =========================================
   1. ADVANCED 3D CARDS
========================================= */
function initAdvancedCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // 1.1 สร้างเลเยอร์แสงสะท้อน
        const glare = document.createElement('div');
        glare.classList.add('glare-effect');
        Object.assign(glare.style, {
            position: 'absolute',
            top: '0', left: '0', width: '100%', height: '100%',
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '4',
            mixBlendMode: 'overlay',
            transition: 'opacity 0.3s'
        });
        card.appendChild(glare);

        let state = {
            mouseX: 0, mouseY: 0,
            currentX: 0, currentY: 0,
            bounds: null
        };

        card.addEventListener('mouseenter', () => {
            state.bounds = card.getBoundingClientRect();
            card.style.transition = 'none';
            const content = card.querySelector('.card-content');
            if(content) content.style.transform = 'translateZ(50px)';
            glare.style.opacity = '1';
        });

        card.addEventListener('mousemove', (e) => {
            if (!state.bounds) return;
            const x = e.clientX - state.bounds.left;
            const y = e.clientY - state.bounds.top;
            
            state.mouseX = (x / state.bounds.width) * 2 - 1;
            state.mouseY = (y / state.bounds.height) * 2 - 1;
            
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, transparent 50%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            glare.style.opacity = '0';
            
            const content = card.querySelector('.card-content');
            if(content) content.style.transform = 'translateZ(0)';
            
            state.mouseX = 0;
            state.mouseY = 0;
        });

        const update = () => {
            state.currentX += (state.mouseX - state.currentX) * 0.1;
            state.currentY += (state.mouseY - state.currentY) * 0.1;

            if (Math.abs(state.mouseX) > 0.01 || Math.abs(state.currentX) > 0.01) {
                const rotateY = state.currentX * 15;
                const rotateX = state.currentY * -15;

                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale3d(1.05, 1.05, 1.05)
                `;
                requestAnimationFrame(update);
            }
        };
        
        card.addEventListener('mouseenter', () => update());
    });
}

/* =========================================
   2. MENU EFFECT (แก้ไขแล้ว: ลบ e.preventDefault ออก)
========================================= */
function initMenuEffect() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // --- ลบ e.preventDefault() ออกเพื่อให้เปลี่ยนหน้าได้ ---
            
            // ลบ Active เก่า
            menuItems.forEach(i => {
                i.classList.remove('active');
                i.style.transform = 'scale(1)';
            });
            
            // ใส่ Active ใหม่
            this.classList.add('active');
            
            // Animation เล็กน้อย (หน้าจะเปลี่ยนเร็วจนอาจมองไม่ทัน แต่นี่คือวิธีที่ถูกครับ)
            this.style.transition = 'transform 0.1s';
            this.style.transform = 'scale(0.95)';
        });
    });
}

/* =========================================
   3. SCROLL REVEAL
========================================= */
function initScrollReveal() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) perspective(1000px)';
        }, 100 + (index * 150));
    });
}