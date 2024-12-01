let aqiSlider; // AQI 滑桿
let aqi = 50;  // 預設 AQI 值
let flowerSeed; // 用於控制花朵造型的隨機種子

function setup() {
    createCanvas(600, 600);
    background(255);

    // 從 URL 中提取 AQI 值，若未提供則默認為 50
    let urlParams = new URLSearchParams(window.location.search);
    aqi = parseInt(urlParams.get("aqi")) || 50;

    // 建立 AQI 滑桿，初始值設為從 URL 提取的 AQI
    aqiSlider = createSlider(0, 500, aqi);
    aqiSlider.position(20, 20);
    aqiSlider.style('width', '200px');

    // 添加滑桿標籤
    createDiv('調整 AQI 數值：').position(20, -5);

    // 設置初始隨機種子
    flowerSeed = random(10000);
}

function draw() {
    background(255);

    // 獲取滑桿當前值作為 AQI 值
    aqi = aqiSlider.value();

    // 顯示 AQI 數值
    displayAQI(aqi);

    // 根據 AQI 繪製花朵
    drawFlower(aqi);

    // 在花朵正下方繪製葉子
    drawLeaves(aqi);
}

function displayAQI(aqi) {
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`AQI: ${aqi}`, 20, 60); // 在畫布左上方顯示 AQI 數值
}

function drawFlower(aqi) {
    translate(width / 2, height / 2); // 將花朵移動到畫布中心
    let petals = map(aqi, 0, 500, 5, 15); // 花瓣數量：AQI 越高，花瓣越雜亂
    let colorSaturation = map(aqi, 0, 500, 255, 100); // 顏色飽和度：AQI 越高，顏色越黯淡

    // 使用隨機種子控制造型
    randomSeed(flowerSeed);

    // 繪製花瓣
    for (let i = 0; i < petals; i++) {
        push();
        rotate((TWO_PI / petals) * i + frameCount * 0.003); // 動態旋轉動畫
        strokeWeight(random(0.5, 1.5));
        stroke(0, 0, 0, map(aqi, 0, 500, 255, 100)); // 線條透明度
        noFill();
        beginShape();
        for (let t = 0; t < TWO_PI; t += 0.1) {
            let r = 50 + noise(t + i + frameCount * 0.003) * map(aqi, 0, 500, 30, 80);
            let x = r * cos(t);
            let y = r * sin(t);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    // 添加動態色塊
    noStroke();
    fill(random(100, 255), colorSaturation, random(100, 255), 150);
    ellipse(random(-20, 20), random(-20, 20), random(50, 70));

    fill(random(50, 200), colorSaturation, random(50, 200), 150);
    ellipse(random(-30, 30), random(-30, 30), random(30, 60));
}

function drawLeaves(aqi) {
    let leafCount = map(aqi, 0, 500, 3, 8); // 葉子數量：AQI 越高，葉子越多
    let colorSaturation = map(aqi, 0, 500, 255, 100); // 葉子顏色飽和度

    for (let i = 0; i < leafCount; i++) {
        push();

        // 固定葉子在花朵正下方生成
        translate(width / 2 + random(-30, 30), height / 2 + random(40, 80)); // 調整葉子生成位置到花朵下方
        rotate(random(-PI / 6, PI / 6)); // 添加葉子的旋轉角度

        // 繪製葉子形狀
        strokeWeight(1);
        stroke(0, 0, 0, map(aqi, 0, 500, 255, 150)); // 葉子線條透明度
        fill(random(50, 150), colorSaturation, random(50, 150), 150); // 葉子顏色
        beginShape();
        for (let t = 0; t < PI; t += 0.1) {
            let r = 40 + noise(t + frameCount * 0.005) * map(aqi, 0, 500, 10, 30);
            let x = r * cos(t);
            let y = r * sin(t);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }
}

// 滑桿釋放時生成新的花朵造型
function mouseReleased() {
    flowerSeed = random(10000); // 更新隨機種子
}
