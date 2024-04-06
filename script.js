document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let score = 0
    let doodlerLeftSpace = 50
    let startPoint = 160
    let doodlerBottomSpace = startPoint
    let isJumping = true
    let upTimerId
    let downTimerId
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId

    class Platform {
        constructor(newPlatBottom) {
            this.left = Math.random() * 362
            this.bottom = newPlatBottom
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 800 / platformCount
            let newPlatBottom = 100 + platGap * i
            let platform = new Platform(newPlatBottom)
            platforms.push(platform)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 150) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function fall() {
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }

            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 15)) &&
                    (doodlerLeftSpace + 60 >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 20)
    }

    fall()

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
                isJumping = false
            }
        }, 30)
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }

        isGoingLeft = true
        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        }, 20)
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = FontFaceSetLoadEvent
        }
        isGoingRight = true
        rightTimerId = setInterval(() => {
            if (doodlerLeftSpace <= 408) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else {
                moveLeft()
            }
        }, 20)
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        doodler.style.bottom = doodlerBottomSpace + 'px'

        if (e.key == 'ArrowLeft') {
            moveLeft()
        } else if (e.key == 'ArrowRight') {
            moveRight()
        } else if (e.key == 'ArrowUp') {
            moveStraight()
        }
    }

    function gameOver() {
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(downTimerId)
        clearInterval(upTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    start()
})