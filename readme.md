# About Laravel React Admin

Bu proje, [Laravel](https://laravel.com) back-end ve [React.js](https://reactjs.org) front-end kullanılarak geliştirilmiş bir görev yönetim sistemidir. Kanban board görünümü, gerçek zamanlı bildirimler ve otomatik görev yönetimi gibi özellikleri içerir.

## Screenshots

<p align="center">
    <a href="https://github.com/palonponjovertlota/laravel-react-admin/actions" title="Actions">
        <img src="https://github.com/user-attachments/assets/8a32514a-c02f-429d-9935-752253579a98" alt="Build Status">
    </a>
</p>


## Features

Frontend
- Kanban board görünümü ile görev yönetimi
- Sürükle-bırak ile durum güncellemesi
- Modal üzerinden görev oluşturma/düzenleme
- Memoization ile optimize edilmiş performans

Backend
- RESTful API endpoints
- Query optimization ve caching
- Queue jobs ile otomatik görev yönetimi,task statu değişimi


# API ENDPOINTS
# Task Management
- GET    `/api/v1/tasks`

       data": [
        
          {
                "id": 18,
                "title": "todo -> inprogress start_time test",
                "description": "todo -> inprogress start_time test description",
                "status": "done",
                "user_id": 2,
                "start_date": "2024-11-20 19:20:00",
                "assigned_to": 3,
                "created_at": "2024-11-20 16:18:36",
                "user": {
                    "id": 2,
                    "name": "Jovert Palonpon",
                    "username": "jovert123",
                    "email": "jovert@example.com"
                },
                "assigned_user": {
                    "id": 3,
                    "name": "Ian Lumbao",
                    "username": "ian123",
                    "email": "ian@example.com"
                }
          },
        
       ],

- POST   `/api/v1/tasks`
-        data": [
        
	         {
                id: 20,
                user_id: 2,
                assigned_to: 3,
                title: "new task",
                description: "new task description",
                status: "todo",
                start_date: "2024-11-23 12:28:00",
                created_by: "2",
                updated_by: null,
                created_at: "2024-11-21 09:30:46",
                updated_at: "2024-11-21 09:30:46",
                deleted_at: null,
                user: {
                    id: 2,
                    name: "Jovert Palonpon",
                    username: "jovert123",
                    email: "jovert@example.com"
                },
                assigned_user: {
                    id: 3,
                    name: "Ian Lumbao",
                    username: "ian123",
                    email: "ian@example.com"
                }
            }
        
       ],
- PUT    `/api/v1/tasks/{id}`
-        data": [
    
              {
                    id: 20,
                    user_id: 2,
                    assigned_to: 3,
                    title: "new task",
                    description: "new task description update",
                    status: "todo",
                    start_date: "2024-11-23 12:28:00",
                    created_by: "2",
                    updated_by: 2,
                    created_at: "2024-11-21 09:30:46",
                    updated_at: "2024-11-21 09:32:43",
                    deleted_at: null,
                    user: {
                    id: 2,
                        name: "Jovert Palonpon",
                        username: "jovert123",
                        email: "jovert@example.com"
                    },
                    assigned_user: {
                        id: 3,
                        name: "Ian Lumbao",
                        username: "ian123",
                        email: "ian@example.com"
                }
            }
        
       ],
- DELETE `/api/v1/tasks/{id}`
-       
	       {
                message: "Task deleted successfully",
                data: {
                id: 21,
                deleted_at: "2024-11-21T09:40:23.847237Z",
                deleted_by: 2
                }
            }

# Task Status
- POST    `/api/v1/tasks/{id}/status`
-        data": [
        
	      {
                message: "Task status updated successfully",
                task: {
                    id: 12,
                    user_id: 2,
                    assigned_to: 2,
                    title: "Queue Job Test",
                    description: "Queue Job Test description",
                    status: "inprogress",
                    start_date: "2024-11-22 18:22:00",
                    created_by: "2",
                    updated_by: "2",
                    created_at: "2024-11-20 15:19:18",
                    updated_at: "2024-11-21 09:34:36",
                    deleted_at: null
                },
                notifications_sent: 1
          }
        
       ],

# Öne Çıkan Özellikler
- Queu job ile task başlangıç tarihine göre otomatik task yönetimi, task'in statu değişimi sağlanması
- Kanban board üzerinde drag&drop ile yapılan islemlerde anlık "statu" değişimi, task-creater-user ve assigned-task-user için notiication_table'a anlık bildirim gitmesi
- Kullanıcıların task oluşturabilmesi, düzenleyebilmesi, silebilmesi için oluşturulmuş API endpoints
- API endpoints üzerinde caching ve query optimizasyonu
- Gereksiz re-rendarları önlemek için callback ile oluşturulmuş child fonksiyonlar ve fetch işlemleri için memoization teknikleri
## Changelog

Please see [CHANGELOG](https://github.com/palonponjovertlota/laravel-react-admin/blob/master/CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [Contributing](https://github.com/palonponjovertlota/laravel-react-admin/blob/master/Contributing.md) for more details.

## Security

If you discover any security-related issues, please email [palonponjovertlota@gmail.com](mailto:palonponjovertlota@gmail.com) instead of using the issue tracker.

## Credits

-   [@reeshkeed](https://github.com/reeshkeed) for designing the logo & design ideas.

## License

The MIT License (MIT). Please see [License File](https://github.com/palonponjovertlota/laravel-react-admin/blob/master/LICENSE) for more information.
