const SSD1306_I2C_ADDRESS = 0x3C  
const SSD1306_SETCONTRAST = 0x81
const SSD1306_DISPLAYALLON_RESUME = 0xA4
const SSD1306_DISPLAYALLON = 0xA5
const SSD1306_NORMALDISPLAY = 0xA6
const SSD1306_INVERTDISPLAY = 0xA7
const SSD1306_DISPLAYOFF = 0xAE
const SSD1306_DISPLAYON = 0xAF
const SSD1306_SUGGESTEDRATIO = 0x80
const SSD1306_SETDISPLAYOFFSET = 0xD3
const SSD1306_SETCOMPINS = 0xDA

const SSD1306_SETVCOMDETECT = 0xDB

const SSD1306_SETDISPLAYCLOCKDIV = 0xD5
const SSD1306_SETPRECHARGE = 0xD9

const SSD1306_SETMULTIPLEX = 0xA8

const SSD1306_SETLOWCOLUMN = 0x00
const SSD1306_SETHIGHCOLUMN = 0x10

const SSD1306_SETSTARTLINE = 0x40

const SSD1306_MEMORYMODE = 0x20
const SSD1306_COLUMNADDR = 0x21
const SSD1306_PAGEADDR = 0x22

const SSD1306_COMSCANINC = 0xC0
const SSD1306_COMSCANDEC = 0xC8

const SSD1306_SEGREMAP = 0xA0

const SSD1306_CHARGEPUMP = 0x8D

const SSD1306_EXTERNALVCC = 0x1
const SSD1306_SWITCHCAPVCC = 0x2

const SSD1306_ACTIVATE_SCROLL = 0x2F
const SSD1306_DEACTIVATE_SCROLL = 0x2E
const SSD1306_SET_VERTICAL_SCROLL_AREA = 0xA3
const SSD1306_RIGHT_HORIZONTAL_SCROLL = 0x26
const SSD1306_LEFT_HORIZONTAL_SCROLL = 0x27
const SSD1306_VERTICAL_AND_RIGHT_HORIZONTAL_SCROLL = 0x29
const SSD1306_VERTICAL_AND_LEFT_HORIZONTAL_SCROLL = 0x2A
const SSD1306_LCDWIDTH = 128

const createWrite = (i2c, address) => value => i2c.writeTo(address, value);

function setup() {
    I2C1.setup({ scl: 5, sda: 4 });
    return I2C1;
}

function displayInitialization(write, height, externalVCC) {
    const initializationCommands = new Uint8Array([
        SSD1306_DISPLAYOFF,
        SSD1306_SETDISPLAYCLOCKDIV,
        SSD1306_SUGGESTEDRATIO,

        SSD1306_SETMULTIPLEX,
        height - 1,
        
        SSD1306_SETDISPLAYOFFSET,
        0x00,
        
        SSD1306_SETSTARTLINE,
        
        SSD1306_CHARGEPUMP,
        externalVCC === SSD1306_EXTERNALVCC ? 0x10 : 0x14,
        
        SSD1306_MEMORYMODE,
        0x00,
        
        SSD1306_SEGREMAP | 0x01,
        SSD1306_COMSCANDEC,
        
        SSD1306_SETCOMPINS,
        height === 64 ? 0x12 : 0x02,
        
        SSD1306_SETCONTRAST,
        externalVCC === SSD1306_EXTERNALVCC ? 0x9F : 0xCF,

        SSD1306_SETPRECHARGE,
        externalVCC === SSD1306_EXTERNALVCC ? 0x22 : 0XF1,

        SSD1306_SETVCOMDETECT,
        0x40,

        SSD1306_DISPLAYALLON_RESUME,
        SSD1306_NORMALDISPLAY,
        SSD1306_DISPLAYON
    ])
    const sendCommand = command => write([0,command]);
    initializationCommands.forEach(val => sendCommand(val));
}

const writeLine = write => bitmapLine => {
    const line = new Uint8Array(SSD1306_LCDWIDTH + 1);
    line.set([SSD1306_SETSTARTLINE], 0)
    line.set(bitmapLine, 1)
    write(line)
}

function createRender(write, height) {
    const renderCommands = new Uint8Array([
        SSD1306_COLUMNADDR,
        0x00, 
        SSD1306_LCDWIDTH - 1,
        
        SSD1306_PAGEADDR,
        0x00,
        (height>>3) - 1
    ]);
    const sendCommand = command => write([0,command]);
    const lineWrite = writeLine(write)
    return bitmap => {
        renderCommands.forEach(val => sendCommand(val))
        
        bitmap.forEach(line => lineWrite(line))
     }
}

function createDisplay(write, height = 32) {
    displayInitialization(write, height)
    const render = createRender(write, height)
    const bitmap = [
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),

        new Uint8Array(SSD1306_LCDWIDTH),
        new Uint8Array(SSD1306_LCDWIDTH),
    ]
    bitmap.forEach(array => array[1] = 1);
    render(bitmap);

}

// TODO - figure out how to set contrast


function main() {
    const i2c = setup();
    const write = createWrite(i2c, SSD1306_I2C_ADDRESS);
    createDisplay(write);
}
