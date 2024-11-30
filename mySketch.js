let aqiSlider; // AQI 滑桿

function setup() {
  createCanvas(600, 600);
  background(255);
	
	let urlParams = new URLSearchParams(window.location.search);
  let aqi = urlParams.get("aqi") || 50; // 如果沒有提供，默認為 50
    // 使用此值初始化花朵繪圖

  // 建立 AQI 滑桿
  aqiSlider = createSlider(0, 500, 50);
  aqiSlider.position(20, 20);
  aqiSlider.style('width', '200px');

  // 添加滑桿標籤
  createDiv('調整 AQI 數值：').position(20, -5);
}

function draw() {
  background(255);
  let aqi = aqiSlider.value(); // 獲取 AQI 數值

  // 根據 AQI 繪製花朵
  drawFlower(aqi);

  // 在花朵正下方繪製葉子
  drawLeaves(aqi);
}

function drawFlower(aqi) {
  translate(width / 2, height / 2); // 將花朵移動到畫布中心
  let petals = map(aqi, 0, 500, 5, 15); // 花瓣數量：AQI 越高，花瓣越雜亂
  let colorSaturation = map(aqi, 0, 500, 255, 100); // 顏色飽和度：AQI 越高，顏色越黯淡

  // 繪製花瓣（動畫速度變慢）
  for (let i = 0; i < petals; i++) {
    push();
    rotate((TWO_PI / petals) * i + frameCount * 0.003); // 減慢旋轉動畫速度
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

// 當滑桿釋放後平滑刷新
function mouseReleased() {
  redraw();
}
