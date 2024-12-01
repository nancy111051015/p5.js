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

    // 顯示 AQI 數值與顏色
    displayAQI(aqi);

    // 根據 AQI 繪製花朵
    drawFlower(aqi);

    // 在花朵正下方繪製葉子
    drawLeaves(aqi);
}

function displayAQI(aqi) {
    let aqiColor = getAQIColor(aqi); // 根據 AQI 獲取顏色

    // 在畫布左上角顯示 AQI 數值
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`AQI: ${aqi}`, 20, 60);

    // 顯示 AQI 顏色的動態大色塊
    noStroke();
    fill(aqiColor);
    rect(20, 100, 100, 50); // 顏色條大小
}

function getAQIColor(aqi) {
    if (aqi <= 50) return color('#00E400'); // 綠色
    if (aqi <= 100) return color('#FFFF00'); // 黃色
    if (aqi <= 150) return color('#FF7E00'); // 橘色
    if (aqi <= 200) return color('#FF0000'); // 紅色
    if (aqi <= 300) return color('#8F3F97'); // 紫色
    return color('#7E0023'); // 褐紅色
}

function drawFlower(aqi) {
    translate(width / 2, height / 2); // 將花朵移動到畫布中心
    let petals = map(aqi, 0, 500, 8, 20); // 花瓣數量：增加最大值
    let colorSaturation = map(aqi, 0, 500, 255, 100); // 顏色飽和度：AQI 越高，顏色越黯淡

    // 使用隨機種子控制造型
    randomSeed(flowerSeed);

    // 繪製花瓣
    for (let i = 0; i < petals; i++) {
        push();
        rotate((TWO_PI / petals) * i + frameCount * 0.005); // 加快旋轉動畫速度
        strokeWeight(random(1, 2));
        stroke(0, 0, 0, map(aqi, 0, 500, 255, 100)); // 線條透明度
        noFill();
        beginShape();
        for (let t = 0; t < TWO_PI; t += 0.1) {
            let r = 60 + noise(t + i + frameCount * 0.01) * map(aqi, 0, 500, 40, 100); // 花瓣變化範圍加大
            let x = r * cos(t);
            let y = r * sin(t);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    // 添加更大的動態色塊
    noStroke();
    fill(random(150, 255), colorSaturation, random(150, 255), 200);
    ellipse(random(-30, 30), random(-30, 30), random(60, 100));

    fill(random(100, 255), colorSaturation, random(100, 255), 200);
    ellipse(random(-40, 40), random(-40, 40), random(50, 90));
}

function drawLeaves(aqi) {
    let leafCount = map(aqi, 0, 500, 5, 10); // 葉子數量增加
    let colorSaturation = map(aqi, 0, 500, 255, 100); // 葉子顏色飽和度

    for (let i = 0; i < leafCount; i++) {
        push();

        // 固定葉子在花朵正下方生成
        translate(width / 2 + random(-30, 30), height / 2 + random(50, 100)); // 調整葉子生成位置到花朵下方
        rotate(random(-PI / 4, PI / 4)); // 添加葉子的旋轉角度

        // 繪製葉子形狀
        strokeWeight(1);
        stroke(0, 0, 0, map(aqi, 0, 500, 255, 150)); // 葉子線條透明度
        fill(random(50, 150), colorSaturation, random(50, 150), 200); // 葉子顏色
        beginShape();
        for (let t = 0; t < PI; t += 0.1) {
            let r = 50 + noise(t + frameCount * 0.005) * map(aqi, 0, 500, 15, 40);
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
