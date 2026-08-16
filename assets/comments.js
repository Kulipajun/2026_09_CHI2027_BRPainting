const body = document.querySelector('#comments-body');
const search = document.querySelector('#comment-search');
const noResults = document.querySelector('#no-results');

function renderComments(query = '') {
  const normalized = query.trim().toLocaleLowerCase();
  const rows = window.paintings.filter(item => {
    const interviewText = window.interviews?.[item.participant]?.excerpts?.join(' ') || '';
    const text = [item.participant, item.site, item.theme, item.brComment, item.baselineComment, item.preference, item.reason, item.feedback, interviewText].join(' ').toLocaleLowerCase();
    return text.includes(normalized);
  });

  body.innerHTML = '';
  rows.forEach(item => {
    const row = document.createElement('tr');
    const cells = [
      `P${String(item.participant).padStart(2, '0')}`,
      item.site,
      item.theme,
      item.firstComment,
      item.secondComment,
      item.preference,
      item.reason,
      item.feedback
    ];
    cells.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
      if (index === 3 || index === 4) {
        const condition = index === 3 ? item.firstCondition : item.secondCondition;
        const marker = document.createElement('strong');
        marker.className = 'condition-marker';
        marker.textContent = `${index === 3 ? '画前' : '画后'}（${condition === 'br' ? 'BR' : 'Baseline'}条件）`;
        const comment = document.createElement('p');
        comment.textContent = value;
        cell.append(marker, comment);
      } else {
        cell.textContent = value;
      }
      if (index === 0) cell.scope = 'row';
      row.appendChild(cell);
    });
    const interviewCell = document.createElement('td');
    const interview = window.interviews?.[item.participant];
    if (interview?.excerpts?.length) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = `${interview.section} · ${interview.excerpts.length} 段`;
      details.appendChild(summary);
      interview.excerpts.forEach(excerpt => {
        const paragraph = document.createElement('p');
        paragraph.textContent = excerpt;
        details.appendChild(paragraph);
      });
      interviewCell.appendChild(details);
    }
    row.appendChild(interviewCell);
    body.appendChild(row);
  });
  noResults.hidden = rows.length > 0;
}

search.addEventListener('input', event => renderComments(event.target.value));
renderComments();
