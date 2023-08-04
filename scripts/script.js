const slider = function(opt) {

    if (!opt.name || !opt.btns.left || !opt.btns.right) return;

    const sliderBlock = document.querySelector('.slider');
    const sliderList = document.querySelector('#' + opt.name);

    if (!sliderList || sliderList.children.length <= 1) return;

    const btnLeft = document.querySelector('#' + opt.btns.left);
    const btnRight = document.querySelector('#' + opt.btns.right);

    if (!btnLeft || !btnRight) return;

    const bulletBtns = document.querySelectorAll('.bullet__item');
    
    const bullet1 = document.querySelector('#' + opt.bullets.n1);
    const bullet2 = document.querySelector('#' + opt.bullets.n2);
    const bullet3 = document.querySelector('#' + opt.bullets.n3);
    const bullet4 = document.querySelector('#' + opt.bullets.n4);

    let time;
    let isFocus = false;

    const images = sliderList.querySelectorAll('img');

    let imagesArr = [];
    images.forEach(function(elem) {
        let src = elem.getAttribute('src');
        elem = src.replace('images/', '');
        imagesArr.push(elem);
    })

    const reset = function() {
        sliderList.style.transform = `translateX(0%)`;
        x = 0;
    }

    // const elemAfter = function() {

    //     const newListElem = document.createElement('div');
    //     newListElem.classList.add('slider__item');

    //     let image = imagesArr.shift();

    //     let img = document.createElement('img');
    //     img.setAttribute('src', `images/${image}`);
    //     newListElem.setAttribute('id', 'new');

    //     newListElem.append(img);
    //     sliderList.append(newListElem);
    // }

    const prevNext = function(btnElem = '') {

        let x = sliderList.style.transform;
        
        if (!x) {
            x = 0;
        } else {
            x = x.replace('translateX(', '');
            x = x.replace('%)', '');
            x = Math.abs(x);
        }

        const curBtn = btnElem.id;
        
        const dir = (curBtn === 'slider1_btn_left') ? 'prev' : 'next';

        x += 20 * (dir == 'prev' ? -1 : 1);

        let stopPoint = (sliderList.children.length - 1) * 20;
        if (stopPoint > 380) stopPoint = 380;
        if (x < 0) x = stopPoint;

        let maxCountExtraElemsAfter = sliderList.querySelectorAll('#new');

        if (maxCountExtraElemsAfter.length >= 5) isLimit = true;

        if (x <= stopPoint) sliderList.style.transform = `translateX(-${x}%)`;
        // if (x > (stopPoint - 100) && !isLimit) elemAfter();
        
        if (dir == 'prev' && x < 0) sliderList.style.transform = `translateX(-${stopPoint}%)`;
        

        bulletBtns.forEach(function(item) {
            item.classList.remove('active');
            switch (true) {
                case x >= 400 || (x >= 0 && x < 100):
                    bullet1.classList.add('active');
                break;
                case x >= 100 && x < 200:
                    bullet2.classList.add('active');
                break;
                case x >= 200 && x < 300:
                    bullet3.classList.add('active');
                break;
                case x >= 300 && x <= 400:
                    bullet4.classList.add('active');
                break;
            }
        })
        
        if (x == 400) reset();
    };

    btnLeft.addEventListener('click', (event) => {
        clearInterval(time);
        prevNext(event.currentTarget);
        isFocus = true;
    });
    btnRight.addEventListener('click', (event) => {
        clearInterval(time);
        prevNext(event.currentTarget);
        isFocus = true;
    });

    bulletBtns.forEach(function(bullet) {

        bullet.addEventListener('click', function() {
            clearInterval(time);
            isFocus = true;
            const step = bullet.dataset.step;

            bulletBtns.forEach(function(item) {
                item.classList.remove('active');
            });
            
            switch(true) {
                case step == '0':
                    sliderList.style.transform = `translateX(${step}%)`;
                    this.classList.toggle('active');
                break;
                case step == '100':
                    sliderList.style.transform = `translateX(-${step}%)`;
                    this.classList.toggle('active');
                break;
                case step == '200':
                    sliderList.style.transform = `translateX(-${step}%)`;
                    this.classList.toggle('active');
                break;
                case step == '300':
                    sliderList.style.transform = `translateX(-${step}%)`;
                    this.classList.toggle('active');
                break;
            };
        })
    })

    const autoSlide = function() {
        time = setInterval(prevNext, 3000);
    }

    autoSlide();

    sliderBlock.addEventListener("mouseleave", () => {
        if (isFocus) autoSlide();
        isFocus = false;
    });
};

window.addEventListener('load', function() {
    
    const slider1_options = {
        name: 'slider1',
        btns: {
            left: 'slider1_btn_left',
            right: 'slider1_btn_right'
        },
        bullets: {
            n1: 'bullet_1',
            n2: 'bullet_2',
            n3: 'bullet_3',
            n4: 'bullet_4'
        }
    };

    slider(slider1_options);
});