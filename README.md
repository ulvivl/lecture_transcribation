# lecture_transcribation

Данный репозиторий создан в рамках хакатона "Цифровой прорыв". 

## Поставленная задача:
Создать интеллектуального ассистента методиста, способного транскрибировать лекцию и создать список основных терминов.

## Описание файлов:
Приложение состоит из бэкенд и фронтенд части, взаимодействующей с помощью FastAPI.
Фронтэнд и бэкенд части проекта размещены в папках `front/` и `back/` соответственно.


## Процесс запуска:
**1) Запуск бэкенда:**

make setup
run all together: 
make application - web app, 
make whisper - consumer with whisperx for transcribation, 
make llm_glosary - consumer with Mistral7B for generation glosary, 
make llm_conspect - with Mistral7B for generation conspect

## Подходы
1) Транскрибация
   - были проведены эксперименты с моделями `whisper-large` и `whisperX`
   - итоговое решение основывается на модели `whisperX` зарекомендовавшей себя как решение, обеспечивающее необходимое качество транскрибаций и высокую скорость работы
2) Выделение глоссария
   Предлагается два решения по формированию глоссария (выбирается в конфигурационном файле):
   
   а) [быстрый baseline] Базовый способ основывается на модели `Saiga-Mistal-7b` и библиотеке `langchain`.
   
   Модель обрабатывает текст по частям, формируемым с помощью специализированного модуля, учитывающего особенности токенайзера `Saiga-Mistal-7b` и структуру лекции.
   Внутри каждой выделенной части модель выделяет термины и определения, далее, полученные результаты агрегируются по всем частям и группируются. В ходе агрегации отдельный блок дополнительно очищает выделенные данные от некорректно сформированных определений. Для терминов, которые были определены в лекции несколько раз - определение включает все формулировки определения.

   б) [высокое качество] Данный подход является развитием baseline и включает в себя более продвинутую фильтрацию и формирование наиболее полных и точных определений.

   На основе полученных терминов, специально разработанный RAG пайплайн, с применением one-shot и airboroso техник дает каждому термину определение, учитывающее всю информацию, полученную из лекции с использованием векторной базы данных и семантического поиска. 
Далее, производится фильтрация терминов, которые не связаны с тематикой лекции или на которых не было достаточного фокуса - то есть тех терминов, с которыми студенты уже были потенциально знакомы.

3) Получение таймкодов
   Таймкоды для терминов и их определений получаются с помощью комбинации модели `whisperX` и векторной базы `Chroma` - на базе utterance-ов ASR модели и векторного поиска по релевантным понятиям. Также предлагается более сложный подход, подробно описываемый в лекции.

5) Генерация тестов
   Генерация заданий осуществляется с помощью модели `Saiga-Mistal-7b`, при формировании корректных ответов на вопросы теста также используется RAG пайплайн, позволяющий получить наиболее полные и точные ответы.
6) Перевод материалов (выбирается в конфигурационном файле)
   Перевод материалов на другие языки осуществляется с помощью специльного модуля модели `whisperX`
