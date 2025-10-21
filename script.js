// 全局变量
let customerData = [];
let metricsData = [];
let userIdCustNoMapping = {};

// 客群表字段定义
const CUSTOMER_FIELDS = {
    cusgroup_id: { type: 'string', required: true, values: [] },
    stat_date: { type: 'string', required: true, values: [] },
    cust_no: { type: 'string', required: true, values: [] },
    user_id: { type: 'string', required: true, values: [] },
    age: { type: 'bigint', required: false, values: [] },
    avg_last_30d_curr_zacb: { type: 'decimal', required: false, values: [] },
    avg_last_90d_curr_zacb: { type: 'decimal', required: false, values: [] },
    avg_last_30d_total_bal: { type: 'decimal', required: false, values: [] },
    avg_last_90d_total_bal: { type: 'decimal', required: false, values: [] },
    curr_deposit_mmf_bal: { type: 'decimal', required: false, values: [] },
    only_channel: { type: 'string', required: false, values: ['MGM', 'Organic', 'Paidmedia', '渠道邀请码'] },
    cert_type: { type: 'string', required: false, values: ['MCV', 'HKID'] },
    invest_open_acct_type: { type: 'array', required: false, values: ['crypto', 'fund', 'hkStock', 'stock'] },
    open_app_notification_flag: { type: 'string', required: false, values: ['Y', 'N'] },
    open_email_notification_flag: { type: 'string', required: false, values: ['Y', 'N'] },
    interest_coupon_ccy_type: { type: 'array', required: false, values: ['中期定存_HKD', '中期定存_USD', '主账户活期加息_HKD', '主账户活期加息_USD', '短期定存_HKD', '短期定存_USD', '钱罐加息_HKD', '长期定存_HKD', '长期定存_USD'] },
    piggy_product_code_list: { type: 'array', required: false, values: ['懒人钱罐', '新资金钱罐', '智安存钱罐', '高息钱罐'] },
    high_pot_rate_add_type: { type: 'array', required: false, values: ['任务加息_HKD', '手工加息_HKD'] },
    piggy_time_aum: { type: 'decimal', required: false, values: [] },
    mon_transfer_type: { type: 'array', required: false, values: ['Card', 'CardATM', 'Cross-Border', 'Crypto', 'FX', 'Fund', 'Loan', 'OpenTD', 'OthTakeout', 'Piggy', 'Redpacket', 'Remit', 'Stock'] },
    fps_bind_bank_name_list: { type: 'array', required: false, values: ['OCBC BANK (HONG KONG) LIMITED', 'ZA Bank Limited', 'tng (asia) limited'] },
    bind_auto_edda_flag: { type: 'string', required: false, values: ['Y', 'N'] },
    mon_fx_trans_dir_ccy_list: { type: 'array', required: false, values: ['CNY_HKD', 'CNY_USD', 'HKD_CNY', 'HKD_USD', 'USD_CNY', 'USD_HKD'] },
    is_mon_fxtd_active: { type: 'string', required: false, values: ['Y', 'N'] },
    has_card_transaction: { type: 'string', required: false, values: ['Y', 'N'] },
    is_ewallet_linked: { type: 'string', required: false, values: ['Y', 'N'] },
    has_active_physical_card: { type: 'string', required: false, values: ['Y', 'N'] },
    payment_card_source: { type: 'string', required: false, values: ['Credit', 'Debit'] },
    rebate_plan: { type: 'string', required: false, values: ['Powerdraw', 'Stockback'] },
    card_active_type: { type: 'string', required: false, values: ['存量客户首刷', '存量未刷卡', '持续活跃', '新客首刷', '新户未刷卡', '沉默', '沉默回流', '流失', '流失回流'] },
    monthly_spending: { type: 'decimal', required: false, values: [] },
    invest_first_apply_product_type_list: { type: 'array', required: false, values: ['Crypto', '无首投', '美股', '货基', '非货'] },
    open_invest_bank_cust_type: { type: 'string', required: false, values: ['ETB(MGM)', 'ETB(Organic)', 'ETB(PaidAd-AppStore)', 'ETB(渠道邀请码)', 'NTB(MGM)', 'NTB(Organic)', 'NTB(PaidAd-AppStore)', 'NTB(渠道邀请码)'] },
    mon_invest_trans_product_type: { type: 'array', required: false, values: ['货基', '非货', '美股', 'Crypto'] },
    invest_holding_product_type_list: { type: 'array', required: false, values: ['美股', '货基', '非货', 'Crypto', '无持仓'] }
};

// DOM 元素引用 - 将在DOM加载完成后初始化
let userCountInput, cusGroupIdInput, statTimeInput, startDateInput, endDateInput;
let generateCustomerBtn, generateMetricsBtn, clearDataBtn, downloadCustomerBtn, downloadMetricsBtn;
let customerPreview, metricsPreview, statusDiv, fieldSelectionGrid;
let selectAllFieldsBtn, deselectAllFieldsBtn, selectRequiredFieldsBtn;
let dataModeSelect, autoModeConfig, manualModeConfig, userIdCustNoInput, parseUserListBtn, userListStatus;
let todayBtn, yesterdayBtn, lastWeekBtn, startDatePreset1, startDatePreset2, startDatePreset3, endDateToday, endDateYesterday;

// 初始化DOM元素引用
function initDOMElements() {
    userCountInput = document.getElementById('userCount');
    cusGroupIdInput = document.getElementById('cusGroupId');
    statTimeInput = document.getElementById('statTime');
    startDateInput = document.getElementById('startDate');
    endDateInput = document.getElementById('endDate');
    generateCustomerBtn = document.getElementById('generateCustomerBtn');
    generateMetricsBtn = document.getElementById('generateMetricsBtn');
    clearDataBtn = document.getElementById('clearDataBtn');
    downloadCustomerBtn = document.getElementById('downloadCustomerBtn');
    downloadMetricsBtn = document.getElementById('downloadMetricsBtn');
    customerPreview = document.getElementById('customerPreview');
    metricsPreview = document.getElementById('metricsPreview');
    statusDiv = document.getElementById('statusInfo');
    fieldSelectionGrid = document.getElementById('fieldSelectionGrid');
    selectAllFieldsBtn = document.getElementById('selectAllFields');
    deselectAllFieldsBtn = document.getElementById('deselectAllFields');
    selectRequiredFieldsBtn = document.getElementById('selectRequiredFields');
    
    // 新增的DOM元素
    dataModeSelect = document.getElementById('dataMode');
    autoModeConfig = document.getElementById('autoModeConfig');
    manualModeConfig = document.getElementById('manualModeConfig');
    userIdCustNoInput = document.getElementById('userIdCustNoInput');
    parseUserListBtn = document.getElementById('parseUserListBtn');
    userListStatus = document.getElementById('userListStatus');
    
    // 日期快捷按钮
    todayBtn = document.getElementById('todayBtn');
    yesterdayBtn = document.getElementById('yesterdayBtn');
    lastWeekBtn = document.getElementById('lastWeekBtn');
    startDatePreset1 = document.getElementById('startDatePreset1');
    startDatePreset2 = document.getElementById('startDatePreset2');
    startDatePreset3 = document.getElementById('startDatePreset3');
    endDateToday = document.getElementById('endDateToday');
    endDateYesterday = document.getElementById('endDateYesterday');
}

// 工具函数
class DataGenerator {
    // 生成随机数字
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 生成随机浮点数
    static randomFloat(min, max, decimals = 2) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    }

    // 从数组中随机选择
    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 从数组中随机选择多个元素
    static randomSample(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 生成用户ID（19位数字）
    static generateUserId() {
        return String(this.randomInt(1000000000000000000, 9999999999999999999));
    }

    // 生成客户号（10位数字）
    static generateCustNo() {
        return String(this.randomInt(1000000000, 9999999999));
    }

    // 生成日期范围
    static getDateRange(startDate, endDate) {
        const dates = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d).toISOString().split('T')[0]);
        }
        
        return dates;
    }

    // 格式化日期为YYYYMMDD
    static formatDateShort(dateStr) {
        return dateStr.replace(/-/g, '');
    }

    // 生成随机日期
    static randomDate(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const randomTime = start + Math.random() * (end - start);
        return new Date(randomTime).toISOString().split('T')[0];
    }

    // 生成随机小数
    static randomDecimal(min, max, decimals) {
        const value = Math.random() * (max - min) + min;
        return parseFloat(value.toFixed(decimals));
    }
}

// 状态管理
class StatusManager {
    static updateStatus(message, type = 'info') {
        statusDiv.innerHTML = `<p>${message}</p>`;
        statusDiv.className = `status-info ${type}`;
    }

    static showLoading(message) {
        this.updateStatus(`<span class="loading"></span>${message}`, 'loading');
    }

    static showSuccess(message) {
        this.updateStatus(message, 'success');
    }

    static showError(message) {
        this.updateStatus(message, 'error');
    }
}

// 客户数据生成器
class CustomerDataGenerator {
    static generate() {
        try {
            const config = this.parseConfig();
            if (!this.validateConfig(config)) return;
            
            StatusManager.showLoading('正在生成客户数据...');
            
            customerData = [];
            userIdCustNoMapping = {};
            
            if (config.mode === 'manual') {
                // 手动输入模式：使用用户提供的 userid+custno 列表
                config.userList.forEach(userInfo => {
                    userIdCustNoMapping[userInfo.userId] = userInfo.custNo;
                    const customer = this.generateCustomerRecord(userInfo.userId, userInfo.custNo, config);
                    customerData.push(customer);
                });
            } else {
                // 自动生成模式：生成随机的 userid+custno
                for (let i = 1; i <= config.userCount; i++) {
                    const userId = DataGenerator.generateUserId();
                    const custNo = DataGenerator.generateCustNo();
                    
                    userIdCustNoMapping[userId] = custNo;
                    
                    const customer = this.generateCustomerRecord(userId, custNo, config);
                    customerData.push(customer);
                }
            }
            
            this.updatePreview();
            this.enableButtons();
            StatusManager.showSuccess(`成功生成 ${customerData.length} 条客户数据`);
            
        } catch (error) {
            StatusManager.showError(`生成客户数据失败: ${error.message}`);
        }
    }
    
    static generateCustomerRecord(userId, custNo, config) {
        const customer = {};
        const selectedFields = config.selectedFields;
        
        selectedFields.forEach(fieldName => {
            const field = CUSTOMER_FIELDS[fieldName];
            
            switch (fieldName) {
                case 'cusgroup_id':
                    customer[fieldName] = config.cusGroupId;
                    break;
                case 'stat_date':
                    customer[fieldName] = config.statTime;
                    break;
                case 'cust_no':
                    customer[fieldName] = custNo;
                    break;
                case 'user_id':
                    customer[fieldName] = userId;
                    break;
                case 'age':
                    customer[fieldName] = DataGenerator.randomInt(18, 65);
                    break;
                case 'monthly_spending':
                    customer[fieldName] = DataGenerator.randomDecimal(100, 10000, 2);
                    break;
                default:
                    customer[fieldName] = this.generateFieldValue(field);
                    break;
            }
        });
        
        return customer;
    }
    
    static generateFieldValue(field) {
        switch (field.type) {
            case 'string':
                if (field.values.length > 0) {
                    return DataGenerator.randomChoice(field.values);
                }
                return `value_${DataGenerator.randomInt(1, 1000)}`;
                
            case 'bigint':
                return DataGenerator.randomInt(1, 1000000);
                
            case 'decimal':
                if (field.values.length > 0) {
                    return DataGenerator.randomChoice(field.values);
                }
                return DataGenerator.randomDecimal(0, 100000, 2);
                
            case 'array':
                if (field.values.length > 0) {
                    const count = DataGenerator.randomInt(1, Math.min(3, field.values.length));
                    const selected = DataGenerator.randomSample(field.values, count);
                    return selected.join(',');
                }
                return '';
                
            default:
                return '';
        }
    }
    
    static parseConfig() {
        const mode = dataModeSelect.value;
        const config = {
            mode: mode,
            cusGroupId: cusGroupIdInput.value || '30047',
            statTime: statTimeInput.value || '2025-09-25',
            selectedFields: FieldSelector.getSelectedFields()
        };
        
        if (mode === 'manual') {
            config.userList = UserListParser.getParsedUserList();
        } else {
            config.userCount = parseInt(userCountInput.value) || 20;
        }
        
        return config;
    }
    
    static validateConfig(config) {
        if (config.mode === 'manual') {
            if (!config.userList || config.userList.length === 0) {
                StatusManager.showError('请先解析用户列表');
                return false;
            }
        } else {
            if (config.userCount < 1 || config.userCount > 1000) {
                StatusManager.showError('用户数量必须在 1-1000 之间');
                return false;
            }
        }
        
        if (config.selectedFields.length === 0) {
            StatusManager.showError('请至少选择一个字段');
            return false;
        }
        
        // 检查必需字段
        const requiredFields = Object.keys(CUSTOMER_FIELDS).filter(key => CUSTOMER_FIELDS[key].required);
        const missingRequired = requiredFields.filter(field => !config.selectedFields.includes(field));
        
        if (missingRequired.length > 0) {
            StatusManager.showError(`缺少必需字段: ${missingRequired.join(', ')}`);
            return false;
        }
        
        return true;
    }

    static updatePreview() {
        if (customerData.length === 0) {
            customerPreview.innerHTML = '<p class="placeholder">暂无数据</p>';
            return;
        }

        const headers = Object.keys(customerData[0]);
        const previewData = customerData.slice(0, 10); // 只显示前10条
        
        let html = '<table>';
        html += '<thead><tr>';
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead>';
        
        html += '<tbody>';
        previewData.forEach(row => {
            html += '<tr>';
            headers.forEach(header => {
                html += `<td>${row[header]}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        
        if (customerData.length > 10) {
            html += `<p style="text-align: center; margin-top: 10px; color: #666;">显示前10条，共${customerData.length}条数据</p>`;
        }
        
        customerPreview.innerHTML = html;
    }

    static enableButtons() {
        downloadCustomerBtn.disabled = false;
        generateMetricsBtn.disabled = false;
    }
}

// 用户列表解析器
class UserListParser {
    static parsedUserList = [];
    
    static parseUserList() {
        try {
            const input = userIdCustNoInput.value.trim();
            if (!input) {
                StatusManager.showError('请输入用户列表');
                return;
            }
            
            StatusManager.showLoading('正在解析用户列表...');
            
            const lines = input.split('\n').filter(line => line.trim());
            const userList = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                const parts = line.split(/[,\t\s]+/); // 支持逗号、制表符、空格分隔
                
                if (parts.length >= 2) {
                    const userId = parts[0].trim();
                    const custNo = parts[1].trim();
                    
                    if (userId && custNo) {
                        userList.push({ userId, custNo });
                    }
                } else {
                    StatusManager.showError(`第 ${i + 1} 行格式错误，请使用 "userid,custno" 格式`);
                    return;
                }
            }
            
            if (userList.length === 0) {
                StatusManager.showError('未解析到有效的用户数据');
                return;
            }
            
            this.parsedUserList = userList;
            userListStatus.textContent = `已解析 ${userList.length} 个用户`;
            userListStatus.className = 'status-success';
            StatusManager.showSuccess(`成功解析 ${userList.length} 个用户`);
            
        } catch (error) {
            StatusManager.showError(`解析用户列表失败: ${error.message}`);
        }
    }
    
    static getParsedUserList() {
        return this.parsedUserList;
    }
    
    static clearParsedUserList() {
        this.parsedUserList = [];
        userListStatus.textContent = '';
        userListStatus.className = '';
    }
}

// 指标数据生成器
class MetricsDataGenerator {
    static generate() {
        if (customerData.length === 0) {
            StatusManager.showError('请先生成客户数据');
            return false;
        }

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        if (!startDate || !endDate) {
            StatusManager.showError('请选择开始和结束日期');
            return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
            StatusManager.showError('开始日期不能晚于结束日期');
            return false;
        }

        StatusManager.showLoading('正在生成指标数据...');

        // 清空之前的指标数据
        metricsData = [];

        // 获取日期范围
        const dateRange = DataGenerator.getDateRange(startDate, endDate);
        
        // 为每个用户生成每天的指标数据
        customerData.forEach(customer => {
            dateRange.forEach(date => {
                const metrics = {
                    user_id: customer.user_id,
                    stat_date: date,
                    cust_no: customer.cust_no,
                    card_trans_cnt: DataGenerator.randomInt(0, 50),
                    card_trans_amt_hkd: DataGenerator.randomDecimal(0, 50000, 12),
                    card_trans_income_hkd: DataGenerator.randomDecimal(0, 5000, 12),
                    card_trans_cost_hkd: DataGenerator.randomDecimal(0, 2000, 12),
                    card_trans_reward_hkd: DataGenerator.randomDecimal(0, 1000, 12),
                    card_trans_net_revenue_hkd: DataGenerator.randomDecimal(0, 3000, 12),
                    total_bal_hkd: DataGenerator.randomDecimal(0, 1000000, 12),
                    saving_bal_hkd: DataGenerator.randomDecimal(0, 500000, 12),
                    core_casa_hkd: DataGenerator.randomDecimal(0, 300000, 12),
                    high_casa_hkd: DataGenerator.randomDecimal(0, 200000, 12),
                    time_bal_hkd: DataGenerator.randomDecimal(0, 500000, 12),
                    net_profit_amount_hkd_deposit: DataGenerator.randomDecimal(0, 10000, 12),
                    saving_income_hkd: DataGenerator.randomDecimal(0, 5000, 12),
                    time_income_hkd: DataGenerator.randomDecimal(0, 5000, 12),
                    total_invest_aum_hkd: DataGenerator.randomDecimal(0, 800000, 12),
                    fund_aum_hkd: DataGenerator.randomDecimal(0, 300000, 12),
                    mmf_aum_hkd: DataGenerator.randomDecimal(0, 200000, 12),
                    non_mmf_aum_hkd: DataGenerator.randomDecimal(0, 100000, 12),
                    stock_aum_hkd: DataGenerator.randomDecimal(0, 200000, 12),
                    crypto_holding_hkd: DataGenerator.randomDecimal(0, 100000, 12),
                    net_profit_amount_hkd_invest: DataGenerator.randomDecimal(0, 8000, 12),
                    stk_net_income: DataGenerator.randomDecimal(0, 3000, 12),
                    crypto_net_income: DataGenerator.randomDecimal(0, 2000, 12),
                    mmf_net_income: DataGenerator.randomDecimal(0, 1000, 12),
                    non_mmf_net_income: DataGenerator.randomDecimal(0, 1500, 12),
                    fund_net_income: DataGenerator.randomDecimal(0, 2000, 12),
                    stock_trans_cnt: DataGenerator.randomInt(0, 30),
                    stock_trans_amt_hkd: DataGenerator.randomDecimal(0, 100000, 12),
                    crypto_trans_cnt: DataGenerator.randomInt(0, 20),
                    crypto_trans_amt_hkd: DataGenerator.randomDecimal(0, 50000, 12),
                    total_aum: DataGenerator.randomDecimal(0, 1500000, 12),
                    net_profit_amount_hkd_retail: DataGenerator.randomDecimal(0, 15000, 12),
                    annualised_total_premium: DataGenerator.randomDecimal(0, 50000, 12),
                    net_profit_amount_hkd_insure: DataGenerator.randomDecimal(0, 3000, 12)
                };
                
                metricsData.push(metrics);
            });
        });

        this.updatePreview();
        this.enableButtons();
        StatusManager.showSuccess(`成功生成 ${metricsData.length} 条指标数据 (${customerData.length} 用户 × ${dateRange.length} 天)`);
        
        return true;
    }

    static updatePreview() {
        if (metricsData.length === 0) {
            metricsPreview.innerHTML = '<p class="placeholder">暂无数据</p>';
            return;
        }

        const headers = Object.keys(metricsData[0]);
        const previewData = metricsData.slice(0, 10); // 只显示前10条
        
        let html = '<table>';
        html += '<thead><tr>';
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead>';
        
        html += '<tbody>';
        previewData.forEach(row => {
            html += '<tr>';
            headers.forEach(header => {
                html += `<td>${row[header]}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        
        if (metricsData.length > 10) {
            html += `<p style="text-align: center; margin-top: 10px; color: #666;">显示前10条，共${metricsData.length}条数据</p>`;
        }
        
        metricsPreview.innerHTML = html;
    }

    static enableButtons() {
        downloadMetricsBtn.disabled = false;
    }
}

// CSV导出器
class CSVExporter {
    static downloadCustomerData() {
        if (customerData.length === 0) {
            StatusManager.showError('没有客户数据可下载');
            return;
        }
        
        try {
            const csv = this.convertToCSV(customerData);
            this.downloadFile(csv, 'customer_data.csv');
            StatusManager.showSuccess('客户数据下载成功');
        } catch (error) {
            StatusManager.showError(`下载失败: ${error.message}`);
        }
    }
    
    static downloadMetricsData() {
        if (metricsData.length === 0) {
            StatusManager.showError('没有指标数据可下载');
            return;
        }
        
        try {
            const csv = this.convertToCSV(metricsData);
            this.downloadFile(csv, 'metrics_data.csv');
            StatusManager.showSuccess('指标数据下载成功');
        } catch (error) {
            StatusManager.showError(`下载失败: ${error.message}`);
        }
    }
    
    static convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [];
        
        // 添加表头
        csvRows.push(headers.join('|'));
        
        // 添加数据行
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // 处理包含管道符的值
                return value !== null && value !== undefined ? String(value).replace(/\|/g, '｜') : '';
            });
            csvRows.push(values.join('|'));
        });
        
        return csvRows.join('\n');
    }
    
    static downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// 数据清理功能
class DataCleaner {
    static clearAll() {
        if (confirm('确定要清空所有数据吗？此操作不可撤销。')) {
            customerData = [];
            metricsData = [];
            userIdCustNoMapping = {};
            
            // 清理用户列表解析状态
            UserListParser.clearParsedUserList();
            
            // 重置预览
            customerPreview.innerHTML = '<p class="placeholder">点击"生成客户数据"开始生成数据</p>';
            metricsPreview.innerHTML = '<p class="placeholder">先生成客户数据，然后点击"生成指标数据"</p>';
            
            // 禁用按钮
            downloadCustomerBtn.disabled = true;
            downloadMetricsBtn.disabled = true;
            generateMetricsBtn.disabled = true;
            
            StatusManager.updateStatus('数据已清空');
        }
    }
}

// 字段选择功能
class FieldSelector {
    static initFieldSelection() {
        this.renderFieldSelection();
        this.initFieldSelectionEvents();
    }

    static renderFieldSelection() {
        const grid = fieldSelectionGrid;
        grid.innerHTML = '';

        Object.keys(CUSTOMER_FIELDS).forEach(fieldName => {
            const field = CUSTOMER_FIELDS[fieldName];
            const fieldItem = document.createElement('div');
            fieldItem.className = `field-item ${field.required ? 'required' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `field_${fieldName}`;
            checkbox.value = fieldName;
            checkbox.checked = field.required; // 必需字段默认选中
            
            const label = document.createElement('label');
            label.htmlFor = `field_${fieldName}`;
            label.textContent = `${fieldName} (${field.type})`;
            
            fieldItem.appendChild(checkbox);
            fieldItem.appendChild(label);
            grid.appendChild(fieldItem);
        });
    }

    static initFieldSelectionEvents() {
        if (selectAllFieldsBtn) {
            selectAllFieldsBtn.addEventListener('click', () => {
                this.selectAllFields();
            });
        }
        
        if (deselectAllFieldsBtn) {
            deselectAllFieldsBtn.addEventListener('click', () => {
                this.deselectAllFields();
            });
        }
        
        if (selectRequiredFieldsBtn) {
            selectRequiredFieldsBtn.addEventListener('click', () => {
                this.selectRequiredFields();
            });
        }
    }

    static selectAllFields() {
        const checkboxes = fieldSelectionGrid.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
    }

    static deselectAllFields() {
        const checkboxes = fieldSelectionGrid.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
    }

    static selectRequiredFields() {
        const checkboxes = fieldSelectionGrid.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const fieldName = cb.value;
            cb.checked = CUSTOMER_FIELDS[fieldName].required;
        });
    }

    static getSelectedFields() {
        const checkboxes = fieldSelectionGrid.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
}

// 日期预设功能
class DatePresets {
    static setToday() {
        const today = new Date().toISOString().split('T')[0];
        statTimeInput.value = today;
    }
    
    static setYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        statTimeInput.value = yesterday.toISOString().split('T')[0];
    }
    
    static setLastWeek() {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        statTimeInput.value = lastWeek.toISOString().split('T')[0];
    }
    
    static setStartDatePreset(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        startDateInput.value = date.toISOString().split('T')[0];
    }
    
    static setEndDateToday() {
        const today = new Date().toISOString().split('T')[0];
        endDateInput.value = today;
    }
    
    static setEndDateYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        endDateInput.value = yesterday.toISOString().split('T')[0];
    }
}

// 数据生成模式管理器
class DataModeManager {
    static toggleMode() {
        const mode = dataModeSelect.value;
        if (mode === 'manual') {
            autoModeConfig.style.display = 'none';
            manualModeConfig.style.display = 'block';
        } else {
            autoModeConfig.style.display = 'block';
            manualModeConfig.style.display = 'none';
        }
    }
}

// 事件监听器
function initEventListeners() {
    if (generateCustomerBtn) {
        generateCustomerBtn.addEventListener('click', () => {
            CustomerDataGenerator.generate();
        });
    }
    
    if (generateMetricsBtn) {
        generateMetricsBtn.addEventListener('click', () => {
            MetricsDataGenerator.generate();
        });
    }
    
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => DataCleaner.clearAll());
    }
    
    if (downloadCustomerBtn) {
        downloadCustomerBtn.addEventListener('click', () => CSVExporter.downloadCustomerData());
    }
    
    if (downloadMetricsBtn) {
        downloadMetricsBtn.addEventListener('click', () => CSVExporter.downloadMetricsData());
    }
    
    // 数据生成模式切换
    if (dataModeSelect) {
        dataModeSelect.addEventListener('change', DataModeManager.toggleMode);
    }
    
    // 用户列表解析
    if (parseUserListBtn) {
        parseUserListBtn.addEventListener('click', UserListParser.parseUserList);
    }
    
    // 日期预设按钮
    if (todayBtn) {
        todayBtn.addEventListener('click', DatePresets.setToday);
    }
    if (yesterdayBtn) {
        yesterdayBtn.addEventListener('click', DatePresets.setYesterday);
    }
    if (lastWeekBtn) {
        lastWeekBtn.addEventListener('click', DatePresets.setLastWeek);
    }
    
    if (startDatePreset1) {
        startDatePreset1.addEventListener('click', () => DatePresets.setStartDatePreset(7));
    }
    if (startDatePreset2) {
        startDatePreset2.addEventListener('click', () => DatePresets.setStartDatePreset(30));
    }
    if (startDatePreset3) {
        startDatePreset3.addEventListener('click', () => DatePresets.setStartDatePreset(90));
    }
    
    if (endDateToday) {
        endDateToday.addEventListener('click', DatePresets.setEndDateToday);
    }
    if (endDateYesterday) {
        endDateYesterday.addEventListener('click', DatePresets.setEndDateYesterday);
    }
}

// 初始化应用
function initApp() {
    // 首先初始化DOM元素引用
    initDOMElements();
    
    // 设置默认日期
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    
    if (startDateInput) startDateInput.value = startDate.toISOString().split('T')[0];
    if (endDateInput) endDateInput.value = today.toISOString().split('T')[0];
    
    // 只渲染字段选择，不初始化事件
    FieldSelector.renderFieldSelection();
    
    // 初始化所有事件监听器
    initEventListeners();
    
    // 初始化字段选择事件
    FieldSelector.initFieldSelectionEvents();
    
    // 初始化数据生成模式显示
    DataModeManager.toggleMode();
    
    StatusManager.updateStatus('应用已初始化，请配置参数后生成数据');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);