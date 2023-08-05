const slider = function(opt) {

    if (!opt.name || !opt.btns.left || !opt.btns.right) return;

    const sliderBlock = document.querySelector('.slider');
    const sliderList = document.querySelector('#' + opt.name);
    const listElems = sliderList.children;

    if (!sliderList || listElems.length <= 1) return;

    const btnLeft = document.querySelector('#' + opt.btns.left);
    const btnRight = document.querySelector('#' + opt.btns.right);

    if (!btnLeft || !btnRight) return;

    const bulletBtns = document.querySelectorAll('.bullet__item');
    
    const bullet1 = document.querySelector('#' + opt.bullets.n1);
    const bullet2 = document.querySelector('#' + opt.bullets.n2);
    const bullet3 = document.querySelector('#' + opt.bullets.n3);
    const bullet4 = document.querySelector('#' + opt.bullets.n4);

    const LIMIT_OF_NEW_ELEMENTS = 5;
    const STOP_POINT = 400;

    let time;
    let isFocus = false;
    let isLimit = false;
    let isWaiting = false;
    let countNewElements = 0;

    let x = sliderList.style.transform;
    
    if (!x) {
        x = 0;
    } else {
        x = x.replace('translateX(', '');
        x = x.replace('%)', '');
        x = Math.abs(x);
    }

    const images = sliderList.querySelectorAll('img');

    let imagesArr = [];

    const containImagesArr = function() {

        images.forEach(function(elem) {
            if (imagesArr.length == 5) return;
            let src = elem.getAttribute('src');
            elem = src.replace('images/', '');
            imagesArr.push(elem);
        });
    };

    const elemAfter = function() {
        if (countNewElements == LIMIT_OF_NEW_ELEMENTS) return;

        const newListElem = document.createElement('div');
        newListElem.classList.add('slider__item');
        newListElem.setAttribute('id', 'new');

        if (imagesArr.length == 0) containImagesArr();

        let image = imagesArr.shift();

        let img = document.createElement('img');
        img.setAttribute('src', `images/${image}`);

        newListElem.append(img);
        sliderList.append(newListElem);

        countNewElements++;
    };

    const createElemsAfter = function() {
        if (countNewElements == LIMIT_OF_NEW_ELEMENTS) {
            isLimit = true;
            return;
        };

        elemAfter();
        Array.from(listElems).forEach(function() {
            createElemsAfter();
        });
    };

    const prevNext = function(btnElem = '') {

        isLimit = false;
        sliderList.style.transition = 'transform 1s ease-in-out';

        const curBtn = btnElem.id;
        
        const dir = (curBtn === 'slider1_btn_left') ? 'prev' : 'next';

        x += 20 * (dir === 'prev' ? -1 : 1);
        if (x > STOP_POINT) x = STOP_POINT;
        if (dir === 'prev') isLimit = true;

        if (x <= STOP_POINT) sliderList.style.transform = `translateX(-${x}%)`;
        if (x > STOP_POINT - 100) elemAfter();
        
        if (dir == 'prev' && x < 0) {
            createElemsAfter();
            countNewElements = LIMIT_OF_NEW_ELEMENTS;
            sliderList.style.transition = `none`;
            sliderList.style.transform = `translateX(-${STOP_POINT - 20}%)`;
            x = STOP_POINT - 20;
            isLimit = true;
            checkBulletStatus();
        };

        let maxCountExtraElemsAfter = '';

        sliderList.addEventListener('transitionend', () => {
            maxCountExtraElemsAfter = sliderList.querySelectorAll('#new');

            if (countNewElements === LIMIT_OF_NEW_ELEMENTS && !isLimit && x === 400) {
                sliderList.style.transition = `none`;
                x = 0;
                sliderList.style.transform = `translateX(-${x}%)`;
                maxCountExtraElemsAfter.forEach(item => item.remove());
                countNewElements = 0;
            };
            checkBulletStatus(x);
        })
    };

    function checkBulletStatus() {
        bulletBtns.forEach(function(item) {
            item.classList.remove('active');
            switch (true) {
                case x >= 0 && x < 100:
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
            };
        });
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
            x = +step;
            sliderList.style.transition = 'transform 1s ease-in-out';

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