## 通讯录管理系统
<!--more-->

添加联系人：姓名 性别 年龄 联系电话 住址 ，最多1000人

显示：当前所有

删除：输名字 删除没有的人-查无此人

查找：按姓名 没有-查无此人

修改：按姓名 都可改

清空：全部 慎用

退出通讯录：



#### 菜单：

封装函数void showmenu() 

在main中调用封装好的函数

#### 添加：

联系人结构体：

通讯录结构体：存放联系人

main函数中创建通讯录

封装 添加联系人函数

测试 功能

#### 显示：

封装显示联系人函数

如果当前没人，记录为空 >0展示

#### 删除

看是否存在：

封装删除函数

#### 查找

封装查找函数

#### 修改

封装 查无此人

``

```c
//菜单：封装函数void showmenu() 
// 在main中调用封装好的函数
#include <iostream>
using namespace std;
#include<string>
#define MAX 1000
//联系人结构体
struct person {
	//姓名
	string m_name;
	//性别 1男2女
	int m_sex;
	//年龄
	int m_age;
	//电话
	string m_phone;
	//住址
	string m_add;
};
// 通讯录结构体
struct addressbooks {
	//通讯录保存的联系人数组
	struct person personarray[MAX];
	//当前记录人数
	int m_size;
};
//1.显示菜单界面
void showmenu() {
	cout << "**************************" << endl;
	cout << "*****  1.添加联系人  *****" << endl;
	cout << "*****  2.显示联系人  *****" << endl;
	cout << "*****  3.删除联系人  *****" << endl;
	cout << "*****  4.查找联系人  *****" << endl;
	cout << "*****  5.修改联系人  *****" << endl;
	cout << "*****  6.清空联系人  *****" << endl;
	cout << "*****  0.退出通讯录  *****" << endl;
	cout << "**************************" << endl;
}
void addperson(addressbooks* abs) {
	if (abs->m_size == MAX) {
		cout << "通讯录已满，无法添加" << endl;
		return;
	}
	else {
		//添加联系人
		//姓名
		string name;
		cout << "请输入姓名" << endl;
		cin >> name;
		abs->personarray[abs->m_size].m_name = name;
		//性别
		cout << "请输入性别" << endl;
		cout << "1--男" << endl;
		cout << "2--女" << endl;
		int sex = 0;
		while (true) {//如果输入的是1或2可退出循环，如果输入的有误重新输入
			cin >> sex;
			if (sex == 1 || sex == 2) {
				abs->personarray[abs->m_size].m_sex = sex;
				break;
			}cout << "请重新输入" << endl;
		}
		//年龄
		cout << "请输入年龄" << endl;
		int age = 0;
		cin >> age;
		abs->personarray[abs->m_size].m_age = age;
		//电话
		cout << "请输入电话" << endl;
		string phone;
		cin >> phone;
		abs->personarray[abs->m_size].m_phone = phone;
		//地址
		cout << "请输入家庭住址" << endl;
		string address;
		cin >> address;
		abs->personarray[abs->m_size].m_add = address;
		//更新通讯录人数
		abs->m_size++;
		cout << "添加成功" << endl;
		system("pause");//请按任意键继续
		system("cls");//清屏操作
	}
}
//显示联系人
void showperson(addressbooks *abs) {
	//判断通讯录中人数是否为0，提示记录为空，不为0显示
	if (abs->m_size == 0) {
		cout << "当前记录为空" << endl;
	}
	else {
		for (int i = 0; i < abs->m_size; i++) {
			cout << "姓名：" << abs->personarray[i].m_name << "\t";//空8个格
			cout << "性别：" << (abs->personarray[i].m_sex ==1?"男":"女" )<< "\t";
			cout << "年龄：" << abs->personarray[i].m_age << "\t";
			cout << "电话" << abs->personarray[i].m_phone << "\t";
			cout << "地址" << abs->personarray[i].m_add << endl;//换行
		}
	}system("pause");//按任意键继续
	system("cls");//清屏
}
//检测联系人是否存在，存在返回联系人所在数组的位置，不存在返回-1
int isexist(addressbooks* abs, string name) {//通讯录 对比名称
	for (int i = 0; i < abs->m_size; i++) {
		//找到要删除的人
		if (abs->personarray[i].m_name == name) {
			return i;//找到了 返回位置
		}
	}return -1;//如果遍历结束都没找到，返回-1
}
//删除
void deleteperson(addressbooks* abs) {
	cout << "请输入要删除的联系人" << endl;
	string name;
	cin >> name;
	//ret==-1 没查到 ret!=-1查到了
	int ret=isexist(abs, name);
	if (ret != -1) {
		//进行删除操作：把要删除项后面的都往前挪移一位，再把总数-1
		//从前往后开始往前移动
		for (int i = ret; i < abs->m_size; i++) {
			abs->personarray[i] = abs->personarray[i + 1];
		}abs->m_size--;//更新人员数
		cout << "删除成功" << endl;
	}
	else {
		cout << "查无此人" << endl;
	}
	system("pause");
	system("cls");
}
//查找
void findperson(addressbooks *abs) {
	cout << "请输入要查找的人" << endl;
	string name;
	cin >> name;
	//判断存不存在
	int ret=isexist(abs, name);
	if (ret != -1) {
		cout << "姓名：" << abs->personarray[ret].m_name << "\t";
		cout << "性别：" << abs->personarray[ret].m_sex << "\t";
		cout << "年龄：" << abs->personarray[ret].m_age << "\t";
		cout << "电话：" << abs->personarray[ret].m_phone << "\t";
		cout << "地址：" << abs->personarray[ret].m_add << "\t";
	}
	else {
		cout << "查无此人" << endl;
	}system("pause");
	system("cls");
}
//修改
void modifyperson(addressbooks* abs) {
	cout << "请输入要修改的联系人" << endl;
	string name;
	cin >> name;
	int ret = isexist(abs, name);
	if (ret != -1) {
		//姓名
		cout << "请输入姓名" << endl;
		cin >> name;
		abs->personarray[ret].m_name = name;
		//性别
		cout << "请输入性别" << endl;
		cout << "1--男" << endl;
		cout << "2--女" << endl;
		int sex = 0;
		while (true) {
			cin >> sex;
			if (sex == 1 || sex == 2) {
				abs->personarray[ret].m_sex = sex;
				break;
			}
			//年龄
			cout << "请输入年龄" << endl;
			int age = 0;
			cin >> age;
			abs->personarray[ret].m_age = age;
			//电话
			//地址
		}
	}
	         else {
		cout << "查无此人" << endl;
	}
	system("pause");
	system("cls");
}
int main() {
	//创建通讯录结构体变量
	addressbooks abs;
	//初始化当前人员个数
	abs.m_size;
	
	int select = 0;// 创建用户输入的变量
	while(true){
		//菜单调用
		showmenu();
		cin >> select;
		switch (select) {
		case 1: //添加
			addperson(&abs);//传地址 可以修改实参
			break;
		case 2: //显示
			showperson(&abs);
			break;
		case 3: {//删除
			cout << "请输入删除的人姓名" << endl;
			string name;
			cin >> name;
			if (isexist(&abs, name) == -1) {
				cout << "查无此人" << endl;
			}
			else {
				cout << "找到此人" << endl;
			}
		}deleteperson(&abs);//把通讯录传进去
			break;
		
		case 4: //查找
			findperson(&abs);
			break;
		case 5: //修改
			break;
		case 6: //清空
			break;
		case 0: //退出
			cout << "欢迎下次使用" << endl;
			system("pause");
			return 0;
			break;
		default:
			break;
	}
		}
		system("pause");
		return 0;
	}

```







